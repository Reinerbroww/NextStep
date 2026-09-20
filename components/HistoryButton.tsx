"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { saveFlow, adoptSession } from "@/lib/flow";

type HistoryEntry = {
  id: number;
  sessionKey: string;
  goal: string;
  nextStep: string | null;
  currentStep: number;
  totalSteps: number;
  completedSteps: number;
  isGoalComplete: boolean;
  updatedAt: string;
};

export default function HistoryButton() {
  const router = useRouter();
  const { language, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<HistoryEntry[] | null>(null);
  const [error, setError] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && entries === null && !error) load();
  }

  async function load() {
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      const list = Array.isArray(data?.entries) ? data.entries : [];
      setEntries(list as HistoryEntry[]);
    } catch {
      setError(true);
    }
  }

  async function clearAll() {
    try {
      await fetch("/api/history", { method: "DELETE" });
      setEntries([]);
    } catch {
      setError(true);
    }
  }

  async function openSession(entry: HistoryEntry) {
    try {
      const res = await fetch(
        `/api/session?key=${encodeURIComponent(entry.sessionKey)}`,
      );
      const data = await res.json();
      if (!data?.flow) return;
      adoptSession(entry.sessionKey);
      saveFlow(data.flow);
      setOpen(false);
      router.push(
        entry.isGoalComplete
          ? "/progress"
          : entry.nextStep
            ? "/next"
            : "/plan",
      );
    } catch {
      // Restoring is best-effort; leave the current session untouched.
    }
  }

  function shortDate(iso: string): string {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
      month: "short",
      day: "numeric",
    });
  }

  function statusLine(e: HistoryEntry): string {
    if (e.isGoalComplete) return t.history.goalComplete;
    if (e.nextStep) {
      return t.history.nextStep.replace(
        "{next}",
        e.nextStep.length > 48 ? e.nextStep.slice(0, 48) + "…" : e.nextStep,
      );
    }
    return t.history.stepsDone
      .replace("{done}", String(e.completedSteps))
      .replace("{total}", String(e.totalSteps));
  }

  return (
    <div className="relative" ref={boxRef}>
      <button
        type="button"
        onClick={toggle}
        aria-label={t.history.title}
        aria-expanded={open}
        className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-background text-secondary transition-colors hover:border-primary hover:text-primary"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 8v4l3 3" />
          <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-14 z-50 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-md border border-border bg-background">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              {t.history.title}
            </p>
            {entries?.length ? (
              <button
                type="button"
                onClick={clearAll}
                className="text-xs text-secondary underline-offset-4 transition-colors hover:text-primary hover:underline"
              >
                {t.history.clearAll}
              </button>
            ) : null}
          </div>

          {entries === null ? (
            <div className="px-4 py-8 text-center">
              {error ? (
                <p className="text-xs text-secondary">{t.history.error}</p>
              ) : (
                <p className="text-xs text-secondary">{t.history.loading}</p>
              )}
            </div>
          ) : entries.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-xs text-secondary">{t.history.empty}</p>
            </div>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {entries.map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => openSession(e)}
                    title={t.history.restoreHint}
                    className="w-full border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-surface-light"
                  >
                    <p className="truncate text-sm font-semibold text-foreground">
                      {e.goal}
                    </p>
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <p className="min-w-0 truncate text-xs text-secondary">
                        {statusLine(e)}
                      </p>
                      <span className="shrink-0 text-xs text-muted">
                        {shortDate(e.updatedAt)}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}