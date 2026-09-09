"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useFlow,
  loadFlow,
  saveFlow,
  completeCurrentStep,
  clearFlow,
  wasFlowCleared,
  currentStepOf,
  isGoalComplete,
  type FlowState,
  type PlanStep,
} from "@/lib/flow";
import Spinner from "@/components/Spinner";

type NextStepResult = {
  nextStep: string;
  minutes: string;
};

async function fetchNextStep(
  goal: string,
  steps: string[],
  currentStep: string | undefined,
): Promise<NextStepResult> {
  const res = await fetch("/api/next-step", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ goal, steps, currentStep: currentStep ?? "" }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Something went wrong.");
  }
  return (await res.json()) as NextStepResult;
}

export default function NextStepPage() {
  const router = useRouter();
  const flow = useFlow();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const restored = loadFlow();

    if (!restored?.goal && !wasFlowCleared()) {
      // No local flow: restore the latest saved session from the database.
      let cancelled = false;
      (async () => {
        try {
          const res = await fetch("/api/session");
          const data = await res.json();
          if (cancelled) return;
          if (data?.flow && data.flow.goal) {
            saveFlow(data.flow);
          } else {
            router.replace("/start");
          }
        } catch {
          if (!cancelled) router.replace("/start");
        }
      })();
      return () => {
        cancelled = true;
      };
    }

    if (!restored?.goal) {
      router.replace("/start");
      return;
    }
    if (restored.nextStep || isGoalComplete(restored)) return;

    let cancelled = false;
    (async () => {
      try {
        const data = await fetchNextStep(
          restored.goal,
          (restored.plan ?? []).map((s: PlanStep) => s.title),
          currentStepOf(restored)?.title,
        );
        if (cancelled) return;
        saveFlow({ ...restored, nextStep: data.nextStep, nextStepMinutes: data.minutes });
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!flow?.goal) {
    return (
      <div className="mx-auto flex w-full max-w-[720px] flex-1 flex-col items-center justify-center gap-4 py-16">
        <Spinner />
        <p className="text-sm text-secondary">Loading your session...</p>
      </div>
    );
  }

  const plan = flow.plan ?? [];
  const allDone = isGoalComplete(flow);
  const currentIdx = plan.findIndex((s) => s.status === "current");
  const stepMarker =
    plan.length > 0 && currentIdx >= 0
      ? `${String(currentIdx + 1).padStart(2, "0")} / ${String(plan.length).padStart(2, "0")}`
      : "";

  async function generate(state: FlowState): Promise<void> {
    const data = await fetchNextStep(
      state.goal,
      (state.plan ?? []).map((s: PlanStep) => s.title),
      currentStepOf(state)?.title,
    );
    saveFlow({ ...state, nextStep: data.nextStep, nextStepMinutes: data.minutes });
  }

  async function handleMarkDone() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const advanced = completeCurrentStep();
      if (!advanced) {
        setBusy(false);
        return;
      }
      if (isGoalComplete(advanced)) {
        setBusy(false);
        return;
      }
      await generate(advanced);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function handleRetry() {
    const f = loadFlow();
    if (!f?.goal || busy) return;
    setBusy(true);
    setError("");
    try {
      await generate(f);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  function handleStartNew() {
    clearFlow();
    router.push("/start");
  }

  const loading = !flow.nextStep && !allDone;

  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-col py-16">
      <nav className="flex items-center justify-between text-sm text-secondary">
        <Link
          href="/plan"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
        >
          <span aria-hidden="true">←</span> Plan
        </Link>
        {stepMarker ? (
          <span className="text-xs font-semibold uppercase tracking-widest text-muted">
            Step {stepMarker}
          </span>
        ) : null}
      </nav>

      <div className="mt-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          Next Step
        </p>

        {loading && !error ? (
          <p className="mt-6 flex items-center gap-3 text-2xl font-semibold tracking-tight text-foreground">
            <Spinner className="h-5 w-5" />
            Finding your next step...
          </p>
        ) : loading && error ? (
          <p className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
            We couldn&apos;t find your next step.
          </p>
        ) : allDone ? (
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            All steps are complete.
          </h1>
        ) : (
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            {flow.nextStep}
          </h1>
        )}

        {!allDone && flow.nextStepMinutes && !loading ? (
          <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-muted">
            {flow.nextStepMinutes} minutes
          </p>
        ) : null}

        {allDone ? (
          <p className="mt-8 max-w-[480px] text-base leading-6 text-secondary">
            You moved from confusion to action, one step at a time. This goal is
            complete.
          </p>
        ) : null}

        {error ? <p className="mt-6 text-sm text-danger">{error}</p> : null}

        <div className="mt-12 border-t border-border" />

        {allDone ? (
          <div className="mt-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <Link
              href="/progress"
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-primary-hover active:bg-primary-active"
            >
              See your progress
            </Link>
            <Link
              href="/start"
              onClick={handleStartNew}
              className="inline-flex h-11 items-center justify-center rounded-md border border-border px-5 text-xs font-semibold tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Start a new session
            </Link>
          </div>
        ) : (
          <>
            <button
              onClick={handleMarkDone}
              disabled={busy || loading}
              className={
                busy || loading
                  ? "pointer-events-none inline-flex h-11 w-full cursor-not-allowed items-center justify-center rounded-md border border-border px-5 text-xs font-semibold tracking-wide text-muted sm:w-auto"
                  : "inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-primary-hover active:bg-primary-active"
              }
            >
              {busy ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner />
                  Updating your plan...
                </span>
              ) : (
                "Mark as Done"
              )}
            </button>
            {error ? (
              <button
                onClick={handleRetry}
                className="mt-4 inline-flex h-11 items-center justify-center rounded-md border border-border px-5 text-xs font-semibold tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                Try again
              </button>
            ) : (
              <p className="mt-4 text-xs leading-5 text-muted">
                Completed it? Mark it done and we will point you to the next
                step.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}