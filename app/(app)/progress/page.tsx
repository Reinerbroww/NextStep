"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useFlow,
  loadFlow,
  saveFlow,
  completeCurrentStep,
  clearFlow,
  wasFlowCleared,
  isGoalComplete,
} from "@/lib/flow";
import Spinner from "@/components/Spinner";

export default function ProgressPage() {
  const router = useRouter();
  const flow = useFlow();

  useEffect(() => {
    const f = loadFlow();
    if (!f?.goal && !wasFlowCleared()) {
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
    if (!f?.goal) {
      router.replace("/start");
    }
  }, [router]);

  if (!flow?.goal) {
    return (
      <div className="mx-auto flex w-full max-w-[720px] flex-1 flex-col items-center justify-center gap-4 py-16">
        <Spinner />
        <p className="text-sm text-secondary">Loading your session...</p>
      </div>
    );
  }

  const steps = flow.plan ?? [];
  const total = steps.length;
  const completed = steps.filter((s) => s.status === "completed").length;
  const allDone = isGoalComplete(flow);

  const stateLabel = (status: string) =>
    status === "completed" ? "Done" : status === "current" ? "Current" : "Up next";

  function handleMarkDone() {
    completeCurrentStep();
  }

  function handleStartNew() {
    clearFlow();
    router.push("/start");
  }

  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-col py-16">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted">
        Progress
      </p>
      <p className="mt-6 text-2xl font-bold leading-9 tracking-tight text-foreground">
        {flow.goal}
      </p>

      <div className="mt-12 flex items-end gap-4">
        <span className="text-7xl font-bold leading-none tracking-tight text-foreground">
          {completed}
        </span>
        <span className="pb-2 text-2xl font-semibold text-muted">/ {total}</span>
      </div>
      <p className="mt-4 text-sm text-secondary">Steps complete</p>

      {allDone ? (
        <div className="mt-8 border-t border-border pt-8">
          <p className="text-lg font-semibold leading-7 text-foreground">
            Goal complete.
          </p>
          <p className="mt-3 text-sm leading-6 text-secondary">
            Every step is done. Ready for the next direction?
          </p>
        </div>
      ) : null}

      <div className="mt-12 divide-y divide-border border-y border-border">
        {steps.map((step) => (
          <div key={step.number} className="flex items-baseline gap-6 py-6">
            <span className="text-sm font-semibold text-muted">
              {step.number}
            </span>
            <div className="flex flex-1 flex-col gap-1">
              <span
                className={`text-xs font-semibold uppercase tracking-widest ${
                  step.status === "current" ? "text-primary" : "text-muted"
                }`}
              >
                {stateLabel(step.status)}
              </span>
              <span
                className={`text-lg font-medium leading-7 ${
                  step.status === "completed"
                    ? "text-muted line-through"
                    : "text-foreground"
                }`}
              >
                {step.title}
              </span>
            </div>
            {step.status === "current" ? (
              <button
                onClick={handleMarkDone}
                className="inline-flex h-9 shrink-0 items-center justify-center rounded-md border border-border px-3 text-xs font-semibold tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                Mark done
              </button>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        {allDone ? (
          <button
            onClick={handleStartNew}
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-primary-hover active:bg-primary-active"
          >
            Start a new session
          </button>
        ) : (
          <Link
            href="/next"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-primary-hover active:bg-primary-active"
          >
            Continue to next step
          </Link>
        )}
        <Link
          href="/plan"
          className="text-sm font-medium text-secondary transition-colors hover:text-primary"
        >
          View plan
        </Link>
      </div>
    </div>
  );
}