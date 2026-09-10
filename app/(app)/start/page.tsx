"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveFlow, loadFlow } from "@/lib/flow";
import { DemoExamples } from "@/components/DemoBanner";
import Spinner from "@/components/Spinner";
import VoiceInput from "@/components/VoiceInput";
import { useTranslation } from "@/lib/i18n";

export default function StartPage() {
  const router = useRouter();
  const { language, t } = useTranslation();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const existing = loadFlow();
    if (existing?.input) {
      queueMicrotask(() => setText(existing.input));
    }
  }, []);

  async function handleContinue() {
    const input = text.trim();
    if (!input || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, language }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong.");
      }
      const data = await res.json();
      saveFlow({
        input,
        context: data.context,
        goal: data.goal,
        isGoalClear: data.isGoalClear,
        clarifyingQuestion: data.clarifyingQuestion,
        plan: null,
        nextStep: null,
        nextStepMinutes: null,
      });
      router.push("/start/understanding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-1 flex-col justify-center py-16">
      <nav className="flex items-center text-sm text-secondary">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
        >
          <span aria-hidden="true">←</span> {t.start.back}
        </Link>
      </nav>

      <h1 className="mt-10 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {t.start.title}
      </h1>
      <p className="mt-3 text-base leading-6 text-secondary">
        {t.start.subtitle}
      </p>

      <label
        htmlFor="mind"
        className="mt-10 block text-xs font-semibold uppercase tracking-widest text-muted"
      >
        {t.start.label}
      </label>
      <textarea
        id="mind"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t.start.placeholder}
        className="mt-3 min-h-[140px] w-full resize-none rounded-md border border-border bg-background p-4 text-base leading-6 text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      />

      <DemoExamples onSelect={setText} />

      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

      {loading ? (
        <p className="mt-6 flex items-center gap-2 text-sm text-secondary">
          <Spinner />
          {t.start.loadingText}
        </p>
      ) : null}

      <div className="mt-6 flex items-end justify-between gap-6">
        <VoiceInput value={text} onChange={setText} />

        <button
          onClick={handleContinue}
          disabled={!text.trim() || loading}
          className={
            text.trim() && !loading
              ? "inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-primary-hover active:bg-primary-active"
              : "pointer-events-none inline-flex h-11 cursor-not-allowed items-center justify-center rounded-md border border-border px-5 text-xs font-semibold tracking-wide text-muted"
          }
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Spinner />
              {t.start.analyzingButton}
            </span>
          ) : (
            t.start.continueButton
          )}
        </button>
      </div>
    </div>
  );
}