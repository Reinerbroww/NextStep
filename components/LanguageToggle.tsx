"use client";

import { useTranslation } from "@/lib/i18n";

export default function LanguageToggle({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useTranslation();

  return (
    <div className={`inline-flex items-center rounded-md border border-border bg-background p-0.5 ${className}`}>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`rounded px-2 py-1 text-xs font-semibold transition-colors ${
          language === "en"
            ? "bg-primary text-white"
            : "text-secondary hover:text-foreground"
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("id")}
        className={`rounded px-2 py-1 text-xs font-semibold transition-colors ${
          language === "id"
            ? "bg-primary text-white"
            : "text-secondary hover:text-foreground"
        }`}
        aria-label="Switch to Bahasa Indonesia"
      >
        ID
      </button>
    </div>
  );
}
