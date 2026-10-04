"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useFlow,
  loadFlow,
  saveFlow,
  completeCurrentStep,
  clearFlow,
  wasFlowCleared,
  currentStepOf,
  attachStepGuidance,
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

function NextStepView() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
            const saved = data.flow as FlowState;
            const cur = currentStepOf(saved);
            if (cur && saved.nextStep && !cur.nextStep) {
              // Heal sessions saved before per-step guidance existed.
              saveFlow(
                attachStepGuidance(
                  saved,
                  cur.number,
                  saved.nextStep,
                  saved.nextStepMinutes ?? "",
                ),
              );
            } else {
              saveFlow(saved);
            }
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

    const current = currentStepOf(restored);
    if (current?.nextStep || restored.nextStep || isGoalComplete(restored)) {
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const data = await fetchNextStep(
          restored.goal,
          (restored.plan ?? []).map((s: PlanStep) => s.title),
          current?.title,
        );
        if (cancelled) return;
        saveFlow(
          attachStepGuidance(
            restored,
            current?.number,
            data.nextStep,
            data.minutes,
          ),
        );
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Something went wrong.",
          );
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
  const current = currentStepOf(flow);
  const stepParam = searchParams.get("step");
  const target =
    plan.find((s) => s.number === stepParam) ?? current ?? plan[0] ?? undefined;
  const isCurrentTarget = target ? target.number === current?.number : true;

  const guidance =
    isCurrentTarget && !target?.nextStep
      ? (flow.nextStep ?? null)
      : (target?.nextStep ?? null);
  const minutes =
    isCurrentTarget && !target?.nextStepMinutes
      ? (flow.nextStepMinutes ?? null)
      : (target?.nextStepMinutes ?? null);

  const stepMarker =
    plan.length > 0 && target
      ? `${String(Number(target.number)).padStart(2, "0")} / ${String(plan.length).padStart(2, "0")}`
      : "";

  async function generate(state: FlowState): Promise<void> {
    const cur = currentStepOf(state);
    const data = await fetchNextStep(
      state.goal,
      (state.plan ?? []).map((s: PlanStep) => s.title),
      cur?.title,
    );
    saveFlow(attachStepGuidance(state, cur?.number, data.nextStep, data.minutes));
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

  const loading = !allDone && isCurrentTarget && !guidance;

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

      {plan.length > 1 ? (
        <nav aria-label="Steps" className="mt-8 flex flex-wrap items-center gap-2">
          {plan.map((s) => {
            const active = s.number === target?.number;
            return (
              <Link
                key={s.number}
                href={s.number === current?.number ? "/next" : `/next?step=${encodeURIComponent(s.number)}`}
                aria-label={`Step ${s.number}`}
                className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-xs font-semibold transition-colors ${
                  active
                    ? "border-primary bg-primary text-white"
                    : s.status === "completed"
                      ? "border-border bg-surface-light text-muted line-through"
                      : s.number === current?.number
                        ? "border-primary/60 text-primary"
                        : "border-border text-secondary hover:border-primary hover:text-primary"
                }`}
              >
                {s.number}
              </Link>
            );
          })}
        </nav>
      ) : null}

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
        ) : guidance ? (
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            {guidance}
          </h1>
        ) : target ? (
          <>
            <h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
              {target.title}
            </h1>
            <p className="mt-4 text-sm leading-6 text-secondary">
              This step hasn&apos;t been started yet — return here when it&apos;s
              your turn to get your next step.
            </p>
          </>
        ) : null}

        {!allDone && minutes && !loading ? (
          <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-muted">
            {minutes} minutes
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
        ) : isCurrentTarget ? (
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
        ) : null}
      </div>
    </div>
  );
}

export default function NextStepPage() {
  return (
    <Suspense fallback={null}>
      <NextStepView />
    </Suspense>
  );
}