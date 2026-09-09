"use client";

import { useEffect, useRef, useState } from "react";
import { useIsClient } from "@/lib/use-is-client";
import { downsample, encodeWav, toBase64 } from "@/lib/wav";
import { useTranslation } from "@/lib/i18n";

type SpeechCtor = new () => SpeechInstance;

type SpeechInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

type SpeechResult = {
  isFinal: boolean;
  0: { transcript: string };
  [index: number]: { transcript: string };
};

type SpeechEvent = {
  resultIndex: number;
  results?: { length: number; [index: number]: SpeechResult };
  length: number;
  [index: number]: SpeechResult;
};

function getSpeechCtor(): SpeechCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechCtor;
    webkitSpeechRecognition?: SpeechCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function recorderSupported(): boolean {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.mediaDevices !== "undefined" &&
    typeof navigator.mediaDevices.getUserMedia === "function"
  );
}

function connectSilently(
  ctx: AudioContext,
  processor: ScriptProcessorNode,
): void {
  const gain = ctx.createGain();
  gain.gain.value = 0;
  processor.connect(gain);
  gain.connect(ctx.destination);
}

function getErrorName(err: unknown): string | null {
  if (err && typeof err === "object" && "name" in err) {
    return String((err as { name?: unknown }).name);
  }
  return null;
}

type VoiceInputProps = {
  value?: string;
  onChange?: (value: string) => void;
  onFinal?: (text: string) => void;
  className?: string;
};

export default function VoiceInput({
  value = "",
  onChange,
  onFinal,
  className = "",
}: VoiceInputProps) {
  const isClient = useIsClient();
  const speechCtor = isClient ? getSpeechCtor() : null;
  const recorderOn = isClient && recorderSupported();

  const [listening, setListening] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [mode, setMode] = useState<"speech" | "recorder" | null>(null);
  const [interim, setInterim] = useState("");
  const [voiceError, setVoiceError] = useState("");
  const [hint, setHint] = useState("");
  const [voiceLocale, setVoiceLocale] = useState("");

  const recRef = useRef<SpeechInstance | null>(null);
  const keepListeningRef = useRef(false);
  const initialTextRef = useRef<string>("");
  const committedFinalsRef = useRef<string>("");
  const currentInterimRef = useRef<string>("");

  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const chunksRef = useRef<Float32Array[]>([]);

  const { language, t } = useTranslation();

  const defaultLocale = language === "id" ? "id-ID" : "en-US";
  const effectiveLocale = isClient
    ? voiceLocale || defaultLocale
    : "en-US";

  const supported = speechCtor !== null || recorderOn;

  useEffect(() => {
    return () => {
      keepListeningRef.current = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      const ctx = ctxRef.current;
      if (ctx) void ctx.close().catch(() => {});
    };
  }, []);

  // Helper to push live concatenated text to onChange / onFinal
  function pushLiveText(finals: string, interimText: string) {
    const base = initialTextRef.current.trim();
    let combined = base;
    if (finals) {
      combined += (combined ? " " : "") + finals.trim();
    }
    if (interimText) {
      combined += (combined ? " " : "") + interimText.trim();
    }

    if (onChange) {
      onChange(combined);
    }
  }

  // ---------- Web Speech API path ----------

  function startSpeech(ctor: SpeechCtor) {
    setHint("");
    setVoiceError("");
    setMode("speech");
    setInterim("");

    // Capture base text at the start of voice session
    initialTextRef.current = value ?? "";
    committedFinalsRef.current = "";
    currentInterimRef.current = "";

    const rec = new ctor();
    rec.lang = effectiveLocale;
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (event) => {
      const resultsList = event.results || event;
      const length = resultsList.length;

      let sessionFinals = "";
      let sessionInterim = "";

      for (let i = 0; i < length; i++) {
        const item = resultsList[i];
        if (!item || !item[0]) continue;
        const transcript = item[0].transcript || "";
        if (item.isFinal) {
          sessionFinals += (sessionFinals ? " " : "") + transcript.trim();
        } else {
          sessionInterim += (sessionInterim ? " " : "") + transcript.trim();
        }
      }

      committedFinalsRef.current = sessionFinals;
      currentInterimRef.current = sessionInterim;
      setInterim(sessionInterim);

      // Trigger Live Writing immediately into the input field!
      pushLiveText(sessionFinals, sessionInterim);

      if (onFinal && sessionFinals) {
        onFinal(sessionFinals);
      }
    };

    rec.onerror = (event) => {
      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        keepListeningRef.current = false;
        setListening(false);
        setInterim("");
        setVoiceError(
          "Microphone access was denied. Allow the microphone in your browser settings and try again.",
        );
      } else if (event.error === "audio-capture") {
        keepListeningRef.current = false;
        setListening(false);
        setInterim("");
        setVoiceError("No microphone was found. Connect one and try again.");
      } else if (event.error === "network") {
        // Fallback to audio recorder + AI transcription if browser speech service is unreachable
        keepListeningRef.current = false;
        setListening(false);
        setInterim("");
        if (recorderOn) {
          void startRecorder(
            "Browser speech service unreachable. Transcribing your voice with AI instead.",
          );
        } else {
          setVoiceError(
            "The speech service could not be reached. Check your internet connection.",
          );
        }
      }
    };

    rec.onend = () => {
      if (keepListeningRef.current) {
        // Commit session finals into base text before restarting
        if (committedFinalsRef.current) {
          const base = initialTextRef.current.trim();
          initialTextRef.current = (
            base +
            (base ? " " : "") +
            committedFinalsRef.current.trim()
          ).trim();
          committedFinalsRef.current = "";
          currentInterimRef.current = "";
        }
        setTimeout(() => {
          const latest = getSpeechCtor();
          if (latest && keepListeningRef.current) startSpeech(latest);
        }, 200);
        return;
      }

      setListening(false);
      setInterim("");
      recRef.current = null;
      setMode((m) => (m === "speech" ? null : m));
    };

    try {
      rec.start();
      recRef.current = rec;
      keepListeningRef.current = true;
      setListening(true);
    } catch {
      keepListeningRef.current = false;
      setVoiceError("Voice input could not start in this browser.");
    }
  }

  function stopSpeech() {
    keepListeningRef.current = false;
    recRef.current?.stop();

    // Ensure final state is committed
    const base = initialTextRef.current.trim();
    let finalCombined = base;
    if (committedFinalsRef.current) {
      finalCombined += (finalCombined ? " " : "") + committedFinalsRef.current.trim();
    }
    if (currentInterimRef.current) {
      finalCombined += (finalCombined ? " " : "") + currentInterimRef.current.trim();
    }

    if (onChange && finalCombined !== value) {
      onChange(finalCombined);
    }
    if (onFinal && (committedFinalsRef.current || currentInterimRef.current)) {
      const added = (
        (committedFinalsRef.current ? committedFinalsRef.current + " " : "") +
        currentInterimRef.current
      ).trim();
      if (added) onFinal(added);
    }

    setListening(false);
    setInterim("");
  }

  // ---------- Recording + AI transcription fallback path ----------

  async function startRecorder(fallbackHint?: string) {
    if (transcribing) return;
    setHint(fallbackHint ?? "");
    setVoiceError("");
    setMode("recorder");
    initialTextRef.current = value ?? "";

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const processor = ctx.createScriptProcessor(4096, 1, 1);
      const chunks: Float32Array[] = [];
      processor.onaudioprocess = (event) => {
        chunks.push(new Float32Array(event.inputBuffer.getChannelData(0)));
      };
      connectSilently(ctx, processor);
      streamRef.current = stream;
      ctxRef.current = ctx;
      sourceRef.current = source;
      processorRef.current = processor;
      chunksRef.current = chunks;
      setListening(true);
    } catch (err) {
      const name = getErrorName(err);
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        setVoiceError(
          "Microphone access was denied. Allow the microphone in your browser and try again.",
        );
      } else if (name === "NotFoundError") {
        setVoiceError("No microphone was found. Connect one and try again.");
      } else {
        setVoiceError(
          "Could not start the microphone in this browser. Use a modern Chrome, Edge, or Safari.",
        );
      }
    }
  }

  function teardownRecorder(): void {
    sourceRef.current?.disconnect();
    processorRef.current?.disconnect();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    const ctx = ctxRef.current;
    if (ctx) void ctx.close().catch(() => {});
    streamRef.current = null;
    ctxRef.current = null;
    sourceRef.current = null;
    processorRef.current = null;
  }

  async function stopRecorder() {
    if (!listening || mode !== "recorder") return;
    const chunks = chunksRef.current;
    const rate = ctxRef.current?.sampleRate ?? 48000;
    setListening(false);
    teardownRecorder();

    let total = 0;
    chunks.forEach((c) => (total += c.length));
    if (total === 0) {
      setVoiceError("Nothing was recorded. Tap Speak and try again.");
      return;
    }
    const merged = new Float32Array(total);
    let offset = 0;
    chunks.forEach((c) => {
      merged.set(c, offset);
      offset += c.length;
    });

    const wav = encodeWav(downsample(merged, rate, 16000), 16000);
    setTranscribing(true);
    try {
      const res = await fetch("/api/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audio: toBase64(wav), mimeType: "audio/wav" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Transcription failed.");
      }
      const data = await res.json();
      const transcript = String(data.text ?? "").trim();
      if (transcript) {
        const base = initialTextRef.current.trim();
        const combined = base + (base ? " " : "") + transcript;
        if (onChange) onChange(combined);
        if (onFinal) onFinal(transcript);
      } else {
        setVoiceError(
          "We couldn't hear any clear speech. Speak clearly and try again.",
        );
      }
    } catch (err) {
      setVoiceError(
        err instanceof Error ? err.message : "Transcription failed. Try again.",
      );
    } finally {
      setTranscribing(false);
      chunksRef.current = [];
    }
  }

  // ---------- Controls ----------

  function start() {
    if (transcribing) return;
    if (speechCtor) {
      startSpeech(speechCtor);
    } else if (recorderOn) {
      void startRecorder();
    } else {
      setVoiceError(
        "Voice input is not supported in this browser. Use a recent Chrome, Edge, or Safari.",
      );
    }
  }

  function stop() {
    if (mode === "speech") stopSpeech();
    else void stopRecorder();
  }

  const statusText = transcribing
    ? t.voice.transcribingAudio
    : listening
      ? mode === "recorder"
        ? t.voice.recordingHint
        : interim
          ? `"${interim}"`
          : t.voice.listeningHint
      : interim
        ? `"${interim}"`
        : t.voice.idleHint;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-3">
        {supported ? (
          <button
            type="button"
            onClick={transcribing ? undefined : listening ? stop : start}
            disabled={transcribing}
            className={
              transcribing
                ? "pointer-events-none inline-flex h-10 cursor-not-allowed items-center gap-2 rounded-md border border-border px-3.5 text-xs font-semibold tracking-wide text-muted"
                : listening
                  ? "inline-flex h-10 items-center gap-2 rounded-md border border-danger/40 bg-danger/10 px-3.5 text-xs font-semibold tracking-wide text-danger transition-colors hover:bg-danger/20"
                  : "inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-3.5 text-xs font-semibold tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            }
          >
            {/* Mic Icon */}
            <svg
              className={`h-4 w-4 ${listening ? "text-danger animate-pulse" : "text-foreground"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>

            <span>{listening ? t.voice.stop : transcribing ? t.voice.transcribing : t.voice.speak}</span>

            {listening ? (
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-danger animate-ping"
              />
            ) : null}
          </button>
        ) : null}

        {speechCtor ? (
          <label className="flex items-center gap-2 text-xs font-medium text-muted">
            <span className="hidden sm:inline">{t.voice.languageLabel}</span>
            <select
              value={effectiveLocale}
              onChange={(e) => setVoiceLocale(e.target.value)}
              disabled={listening}
              aria-label="Voice language"
              className="h-10 rounded-md border border-border bg-background px-2 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
            >
              <option value="en-US">English</option>
              <option value="id-ID">Bahasa Indonesia</option>
              <option value="es-ES">Español</option>
              <option value="fr-FR">Français</option>
              <option value="de-DE">Deutsch</option>
              <option value="ja-JP">日本語</option>
            </select>
          </label>
        ) : null}
      </div>

      {supported ? (
        <p className="max-w-[320px] text-xs leading-5 text-muted">
          {statusText}
        </p>
      ) : (
        <p className="max-w-[280px] text-xs leading-5 text-muted">
          {t.voice.notSupported}
        </p>
      )}

      {hint ? (
        <p className="max-w-[320px] text-xs leading-5 text-muted">{hint}</p>
      ) : null}
      {voiceError ? (
        <p className="max-w-[320px] text-xs leading-5 text-danger">{voiceError}</p>
      ) : null}
    </div>
  );
}