"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadFlow, saveFlow, useFlow, type PlanStep } from "@/lib/flow";
import { useDemoMode } from "@/components/DemoBanner";
import Spinner from "@/components/Spinner";
import VoiceInput from "@/components/VoiceInput";
import { useTranslation } from "@/lib/i18n";

function ConfidenceBar({ score, isClear }: { score: number; isClear: boolean }) {
  const { t } = useTranslation();
  const effectiveScore = isClear ? 100 : Math.min(99, Math.max(15, score));

  let hintText = t.goal.confidenceHintLow;
  if (effectiveScore >= 90 || isClear) {
    hintText = t.goal.confidenceHintHigh;
  } else if (effectiveScore >= 50) {
    hintText = t.goal.confidenceHintMed;
  }

  return (
    <div className="mt-6 rounded-xl border border-border bg-surface-light p-4 shadow-xs">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-muted">
        <span className="flex items-center gap-2 font-medium text-foreground">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          {t.goal.confidenceTitle}
        </span>
        <span className="text-sm font-bold text-primary">{effectiveScore}%</span>
      </div>
      <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-surface">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary/80 via-primary to-blue-600 transition-all duration-700 ease-out"
          style={{ width: `${effectiveScore}%` }}
        />
      </div>
      <p className="mt-2 text-xs leading-relaxed text-secondary">{hintText}</p>
    </div>
  );
}

function GoalFlow({
  initialGoal,
  initialQuestion,
}: {
  initialGoal: string;
  initialQuestion: string;
}) {
  const router = useRouter();
  const flow = useFlow();
  const { demo } = useDemoMode();
  const { t } = useTranslation();
  const [goal, setGoal] = useState(initialGoal);
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const confidenceScore = flow?.confidenceScore ?? (question ? 35 : 100);

  useEffect(() => {
    if (demo && question) {
      queueMicrotask(() => setAnswer(t.demo.demoAnswer));
    }
  }, [demo, question, t]);

  async function handleClarify() {
    if (!answer.trim() || loading) return;
    setLoading(true);
    setError("");
    const currentFlow = loadFlow();
    if (!currentFlow) {
      router.replace("/start");
      return;
    }
    const currentClarifyCount = currentFlow.clarifyCount ?? 1;
    const nextClarifyCount = currentClarifyCount + 1;

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: `${currentFlow.input}\nAnswer: ${answer}`,
          clarifyCount: nextClarifyCount,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong.");
      }
      const data = await res.json();
      saveFlow({
        ...currentFlow,
        input: `${currentFlow.input}\nAnswer: ${answer}`,
        context: data.context || currentFlow.context,
        goal: data.goal,
        isGoalClear: data.isGoalClear,
        clarifyingQuestion: data.clarifyingQuestion,
        clarifyCount: nextClarifyCount,
        confidenceScore: data.confidenceScore ?? (data.isGoalClear ? 100 : 75),
      });
      setGoal(data.goal);
      setQuestion(data.isGoalClear ? "" : data.clarifyingQuestion);
      setAnswer("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm() {
    const trimmedGoal = goal.trim();
    if (!trimmedGoal || loading) return;
    setLoading(true);
    setError("");
    const currentFlow = loadFlow() ?? {
      input: "",
      context: "",
      goal: trimmedGoal,
      isGoalClear: true,
      clarifyingQuestion: "",
      plan: null,
      nextStep: null,
      nextStepMinutes: null,
    };
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: trimmedGoal }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong.");
      }
      const data = await res.json();
      const plan: PlanStep[] = data.steps.map(
        (s: { number: string; title: string; description: string }, i: number) => ({
          number: s.number || String(i + 1).padStart(2, "0"),
          title: s.title,
          description: s.description,
          status: i === 0 ? "current" : "up-next",
        }),
      );
      saveFlow({ ...currentFlow, goal: trimmedGoal, plan, confidenceScore: 100 });
      router.push("/plan");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  async function handleNotWhatIWant() {
    if (loading) return;
    setLoading(true);
    setError("");
    const currentFlow = loadFlow();
    if (!currentFlow) {
      router.replace("/start");
      return;
    }
    const currentClarifyCount = currentFlow.clarifyCount ?? 1;
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: currentFlow.input,
          clarifyCount: currentClarifyCount,
          refine: true,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong.");
      }
      const data = await res.json();
      saveFlow({
        ...currentFlow,
        context: data.context || currentFlow.context,
        goal: data.goal,
        isGoalClear: data.isGoalClear,
        clarifyingQuestion: data.clarifyingQuestion,
        clarifyCount: data.isGoalClear ? currentClarifyCount : currentClarifyCount + 1,
        confidenceScore: data.confidenceScore ?? (data.isGoalClear ? 100 : 60),
      });
      setGoal(data.goal);
      setQuestion(data.isGoalClear ? "" : data.clarifyingQuestion);
      setAnswer("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <p className="mt-10 text-xs font-semibold uppercase tracking-widest text-muted">
        {t.goal.direction}
      </p>

      {/* Dynamic Confidence Score Progress Bar */}
      <ConfidenceBar score={confidenceScore} isClear={!question} />

      {question ? (
        <div className="mt-8 border-t border-border pt-8">
          <p className="text-2xl font-bold leading-9 tracking-tight text-foreground">
            {question}
          </p>
          <label
            htmlFor="answer"
            className="mt-8 block text-xs font-semibold uppercase tracking-widest text-muted"
          >
            {t.goal.answerLabel}
          </label>
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={t.goal.answerPlaceholder}
            className="mt-3 min-h-[120px] w-full resize-none rounded-md border border-border bg-background p-4 text-base leading-6 text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          />
          <div className="mt-6 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
            <VoiceInput value={answer} onChange={setAnswer} />
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleNotWhatIWant}
                disabled={loading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface-light px-4 text-xs font-semibold tracking-wide text-secondary shadow-xs transition-all hover:border-border-strong hover:bg-surface hover:text-foreground active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner />
                    {t.goal.refiningDirection}
                  </span>
                ) : (
                  <>
                    <svg className="h-4 w-4 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {t.goal.notMyDirection}
                  </>
                )}
              </button>
              <button
                onClick={handleClarify}
                disabled={!answer.trim() || loading}
                className={
                  answer.trim() && !loading
                    ? "inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-xs font-semibold tracking-wide text-white transition-all hover:bg-primary-hover active:bg-primary-active shadow-xs"
                    : "pointer-events-none inline-flex h-11 cursor-not-allowed items-center justify-center rounded-md border border-border px-5 text-xs font-semibold tracking-wide text-muted"
                }
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner />
                    {t.goal.clarifyingLoading}
                  </span>
                ) : (
                  t.start.continueButton
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
            {goal || "..."}
          </h1>

          <div className="mt-12 border-t border-border pt-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              {t.goal.isRightDirection}
            </p>
            <label
              htmlFor="goal"
              className="mt-6 block text-xs font-semibold uppercase tracking-widest text-muted"
            >
              {t.goal.editGoalLabel}
            </label>
            <textarea
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="mt-3 min-h-[100px] w-full resize-none rounded-md border border-border bg-background p-4 text-base leading-6 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            />
            <div className="mt-4">
              <VoiceInput value={goal} onChange={setGoal} />
            </div>
          </div>
        </>
      )}

      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}

      {!question ? (
        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Link
            href="/start"
            className="inline-flex h-11 items-center justify-center rounded-md border border-border px-5 text-xs font-semibold tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {t.goal.editGoalButton}
          </Link>
          <button
            onClick={handleConfirm}
            disabled={!goal.trim() || loading}
            className={
              goal.trim() && !loading
                ? "inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-primary-hover active:bg-primary-active shadow-xs"
                : "pointer-events-none inline-flex h-11 cursor-not-allowed items-center justify-center rounded-md border border-border px-5 text-xs font-semibold tracking-wide text-muted"
            }
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Spinner />
                {t.goal.buildingPlanLoading}
              </span>
            ) : (
              t.goal.confirmGoalButton
            )}
          </button>
          <button
            onClick={handleNotWhatIWant}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface-light px-4 text-xs font-semibold tracking-wide text-secondary shadow-xs transition-all hover:border-border-strong hover:bg-surface hover:text-foreground active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Spinner />
                {t.goal.refiningDirection}
              </span>
            ) : (
              <>
                <svg className="h-4 w-4 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t.goal.notMyDirection}
              </>
            )}
          </button>
        </div>
      ) : null}
    </>
  );
}

export default function GoalPage() {
  const router = useRouter();
  const flow = useFlow();
  const { t } = useTranslation();

  useEffect(() => {
    const f = loadFlow();
    if (f && !f.input) {
      router.replace("/start");
    }
  }, [router]);

  if (!flow?.input) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-col py-16">
      <nav className="flex items-center text-sm text-secondary">
        <Link
          href="/start"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
        >
          <span aria-hidden="true">←</span> {t.start.back}
        </Link>
      </nav>

      <GoalFlow
        initialGoal={flow.goal}
        initialQuestion={flow.clarifyingQuestion ?? ""}
      />
    </div>
  );
}
