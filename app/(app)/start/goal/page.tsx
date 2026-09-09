"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadFlow, saveFlow, useFlow, type PlanStep } from "@/lib/flow";
import Spinner from "@/components/Spinner";
import VoiceInput from "@/components/VoiceInput";

function GoalFlow({
  initialGoal,
  initialQuestion,
}: {
  initialGoal: string;
  initialQuestion: string;
}) {
  const router = useRouter();
  const [goal, setGoal] = useState(initialGoal);
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClarify() {
    if (!answer.trim() || loading) return;
    setLoading(true);
    setError("");
    const flow = loadFlow();
    if (!flow) {
      router.replace("/start");
      return;
    }
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: `${flow.input}\n${answer}` }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong.");
      }
      const data = await res.json();
      saveFlow({ ...flow, ...data });
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
    const flow = loadFlow() ?? {
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
      saveFlow({ ...flow, goal: trimmedGoal, plan });
      router.push("/plan");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <>
      <p className="mt-10 text-xs font-semibold uppercase tracking-widest text-muted">
        Your Direction
      </p>

      {question ? (
        <div className="mt-6 border-t border-border pt-8">
          <p className="text-2xl font-bold leading-9 tracking-tight text-foreground">
            {question}
          </p>
          <label
            htmlFor="answer"
            className="mt-8 block text-xs font-semibold uppercase tracking-widest text-muted"
          >
            Your answer
          </label>
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="mt-3 min-h-[120px] w-full resize-none rounded-md border border-border bg-background p-4 text-base leading-6 text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          />
          <div className="mt-6 flex items-end justify-between gap-6">
            <VoiceInput value={answer} onChange={setAnswer} />
            <button
              onClick={handleClarify}
              disabled={!answer.trim() || loading}
              className={
                answer.trim() && !loading
                  ? "inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-primary-hover active:bg-primary-active"
                  : "pointer-events-none inline-flex h-11 cursor-not-allowed items-center justify-center rounded-md border border-border px-5 text-xs font-semibold tracking-wide text-muted"
              }
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner />
                  Understanding your answer...
                </span>
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
            {goal || "..."}
          </h1>

          <div className="mt-12 border-t border-border pt-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              Is this the right direction?
            </p>
            <label
              htmlFor="goal"
              className="mt-6 block text-xs font-semibold uppercase tracking-widest text-muted"
            >
              Edit your goal
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
        <div className="mt-12 flex items-center gap-4">
          <Link
            href="/start"
            className="inline-flex h-11 items-center justify-center rounded-md border border-border px-5 text-xs font-semibold tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Edit Goal
          </Link>
          <button
            onClick={handleConfirm}
            disabled={!goal.trim() || loading}
            className={
              goal.trim() && !loading
                ? "inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-primary-hover active:bg-primary-active"
                : "pointer-events-none inline-flex h-11 cursor-not-allowed items-center justify-center rounded-md border border-border px-5 text-xs font-semibold tracking-wide text-muted"
            }
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Spinner />
                Building your plan...
              </span>
            ) : (
              "Confirm Goal"
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
          <span aria-hidden="true">←</span> Back
        </Link>
      </nav>

      <GoalFlow
        initialGoal={flow.goal}
        initialQuestion={flow.clarifyingQuestion ?? ""}
      />
    </div>
  );
}
