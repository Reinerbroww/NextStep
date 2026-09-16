const API_KEY = process.env.GEMINI_API_KEY;

const PRIMARY_MODEL = process.env.GEMINI_MODEL ?? "gemini-3.6-flash";

// Fallback models tried in order if the primary model is unavailable or overloaded (503 / 429).
const FALLBACK_MODELS = process.env.GEMINI_FALLBACK_MODELS
  ? process.env.GEMINI_FALLBACK_MODELS.split(",").map((m) => m.trim()).filter(Boolean)
  : [
      "gemini-3.5-flash",
      "gemini-3.5-flash-lite",
      "gemini-3.1-flash-lite",
      "gemini-flash-lite-latest",
      "gemini-3-flash-preview",
    ];

const MODELS = Array.from(new Set([PRIMARY_MODEL, ...FALLBACK_MODELS]));

const MAX_ATTEMPTS = 2;
const BASE_DELAY_MS = 350;
const REQUEST_TIMEOUT_MS = 25000;

// Status codes that are worth retrying (transient high demand, rate limit, server error).
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

type Part =
  | { text: string }
  | { inlineData: { mimeType: string; data: string } };

type ApiTextResult = {
  text: string;
  model: string;
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function sanitizeAiErrorMessage(err: unknown, language: string = "en"): string {
  const message = err instanceof Error ? err.message : String(err);
  const isIndonesian = language === "id" || language.toLowerCase().includes("indonesia");

  if (!API_KEY) {
    return isIndonesian
      ? "Konfigurasi GEMINI_API_KEY belum dipasang. Tambahkan ke .env.local untuk menggunakan AI."
      : "GEMINI_API_KEY is not configured. Add it to .env.local to use the AI.";
  }

  if (
    message.includes("503") ||
    message.includes("429") ||
    message.includes("UNAVAILABLE") ||
    message.includes("high demand") ||
    message.includes("overloaded")
  ) {
    return isIndonesian
      ? "Layanan AI sedang mengalami lonjakan pemakaian tinggi saat ini. Silakan coba lagi beberapa saat lagi."
      : "The AI service is currently experiencing high demand. Please try again in a moment.";
  }

  if (message.includes("401") || message.includes("403") || message.includes("API key")) {
    return isIndonesian
      ? "Kunci API AI tidak valid atau tidak memiliki izin."
      : "The AI API key is invalid or unauthorized.";
  }

  return isIndonesian
    ? "Tidak dapat terhubung ke AI saat ini. Silakan periksa koneksi Anda dan coba lagi."
    : "Unable to reach the AI service right now. Please check your connection and try again.";
}

async function requestToModel(
  model: string,
  parts: Part[],
  temperature: number,
  responseMimeType: string,
  signal: AbortSignal,
): Promise<ApiTextResult> {
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/" +
    `${model}:generateContent?key=${encodeURIComponent(API_KEY as string)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: {
        temperature,
        responseMimeType,
      },
    }),
    signal,
  });

  if (!res.ok) {
    const body = await res.text();
    const err = new Error(`Gemini API error ${res.status}: ${body.slice(0, 300)}`);
    (err as Error & { status?: number }).status = res.status;
    throw err;
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return { text, model };
}

// Tries the model list with automatic retry & fallback model switching on overload (503/429)
async function runWithFallback(
  parts: Part[],
  temperature: number,
  responseMimeType: string,
): Promise<ApiTextResult> {
  if (!API_KEY) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Add it to .env.local to use the AI.",
    );
  }

  let lastError: unknown = null;

  for (const model of MODELS) {
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      try {
        return await requestToModel(
          model,
          parts,
          temperature,
          responseMimeType,
          controller.signal,
        );
      } catch (err) {
        lastError = err;
        const status = (err as Error & { status?: number }).status;

        // Non-retryable (401/403/404): try next model immediately.
        if (status !== undefined && !RETRYABLE_STATUS.has(status)) {
          break;
        }

        // Retryable (503/429/500/502/504): short backoff and retry.
        if (attempt < MAX_ATTEMPTS - 1) {
          await delay(BASE_DELAY_MS * (attempt + 1) + Math.random() * 200);
        }
      } finally {
        clearTimeout(timeout);
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("All AI attempts failed.");
}

export type AiResponse = {
  text: string;
  raw?: unknown;
  model?: string;
};

export async function generateFromPrompt(prompt: string): Promise<AiResponse> {
  const result = await runWithFallback(
    [{ text: prompt }],
    0.5,
    "application/json",
  );
  return { text: result.text, model: result.model };
}

export async function transcribeAudio(
  audioBase64: string,
  mimeType: string,
): Promise<AiResponse> {
  const result = await runWithFallback(
    [
      {
        inlineData: {
          mimeType,
          data: audioBase64,
        },
      },
      {
        text: "Transcribe the speech in this audio verbatim. Preserve the language it was spoken in. Only output the transcribed words, nothing else. If there is no clear speech, output an empty string. Respond with strict JSON only: { \"text\": \"the transcription\" }",
      },
    ],
    0,
    "application/json",
  );
  return { text: result.text, model: result.model };
}

export function parseJson<T>(text: string): T {
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]) as T;
      } catch {
        // ignore and fallback below
      }
    }
    return { text: cleaned } as unknown as T;
  }
}