// Lightweight stopword-based language detection used to make the AI answer in
// the language the user writes in. Returns null when unsure so the model can
// fall back to mirroring the input itself.

type LanguageProfile = {
  name: string;
  words: string[];
  minHits?: number;
};

const PROFILES: LanguageProfile[] = [
  {
    name: "Bahasa Indonesia",
    words: [
      "yang", "saya", "aku", "kamu", "anda", "tidak", "sudah", "belum",
      "untuk", "dengan", "dari", "kenapa", "mengapa", "bagaimana", "apa",
      "perlu", "bisa", "harus", "ingin", "jadi", "langkah", "tujuan",
      "buat", "mau", "membuat", "belajar", "atau", "kalau", "cara",
    ],
  },
  {
    name: "English",
    words: [
      "the", "and", "want", "need", "can", "how", "what", "why", "should",
      "this", "that", "please", "because", "would", "could", "help",
      "learn", "make", "build", "start", "going", "back", "with", "from",
    ],
  },
  {
    name: "Spanish",
    words: [
      "hola", "quiero", "necesito", "puedo", "cómo", "qué", "por qué",
      "para", "mi", "estoy", "tengo", "no", "más", "hacer", "aprender",
      "crear", "ahora", "cuando", "sin", "pero",
    ],
  },
  {
    name: "French",
    words: [
      "bonjour", "je", "veux", "besoin", "peux", "comment", "quoi",
      "pourquoi", "pour", "suis", "ai", "pas", "faire", "apprendre",
      "créer", "maintenant", "avec", "mais", "dont",
    ],
  },
  {
    name: "German",
    words: [
      "ich", "möchte", "will", "muss", "wie", "was", "warum", "soll",
      "nicht", "für", "mit", "jetzt", "machen", "lernen", "bauen",
      "mein", "eine", "kann",
    ],
  },
  {
    name: "Japanese",
    // Japanese has no spaces between words, so these use raw substring
    // matching instead. A single sentence-ending particle is already a
    // strong signal, so the threshold is lower.
    words: ["です", "ます", "ください", "したい", "しなければ"],
    minHits: 1,
  },
  {
    name: "Portuguese",
    words: [
      "eu", "quero", "preciso", "posso", "como", "o que", "por que",
      "para", "estou", "tenho", "não", "fazer", "aprender", "criar",
      "agora", "sem", "mas",
    ],
  },
];

function hitCount(text: string, words: string[]): number {
  return words.reduce(
    // Words containing a space use boundary matching; single tokens (incl.
    // Japanese endings, which appear mid-sentence without spaces) match
    // anywhere.
    (count, w) => count + (w.includes(" ") ? text.includes(` ${w} `) ? 1 : 0 : text.includes(w) ? 1 : 0),
    0,
  );
}

export function detectLanguage(text: string): string | null {
  if (!text) return null;
  const lower = ` ${text.toLowerCase()} `;

  const scored = PROFILES.map((p) => ({
    name: p.name,
    hits: hitCount(lower, p.words),
    minHits: p.minHits ?? 2,
  }))
    .filter((p) => p.hits >= p.minHits)
    .sort((a, b) => b.hits - a.hits);

  if (scored.length === 0) return null;
  const top = scored[0];
  return top.name;
}

// Maps the UI language code ("en"/"id") used by the i18n layer to a name the
// model understands, as a fallback when detection is uncertain.
export function languageCodeToName(code: string | undefined): string | null {
  if (code === "id") return "Bahasa Indonesia";
  if (code === "en") return "English";
  if (code === "es") return "Spanish";
  if (code === "fr") return "French";
  if (code === "de") return "German";
  if (code === "ja") return "Japanese";
  if (code === "pt") return "Portuguese";
  return null;
}