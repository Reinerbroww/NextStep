"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFlow, loadFlow } from "@/lib/flow";
import Button from "@/components/Button";

export default function PlanPage() {
  const router = useRouter();
  const flow = useFlow();

  useEffect(() => {
    const f = loadFlow();
    if (!f?.goal) {
      router.replace("/start");
    }
  }, [router]);

  if (!flow?.goal) {
    return null;
  }

  const steps = flow.plan ?? [];

  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-col py-16">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted">
        Your Plan
      </p>

      <div className="mt-2 border-t border-border pt-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          Goal
        </p>
        <p className="mt-2 text-2xl font-bold leading-9 tracking-tight text-foreground">
          {flow.goal}
        </p>
      </div>

      {steps.length === 0 ? (
        <div className="mt-10 border-t border-border py-8">
          <p className="text-base text-secondary">
            Your plan is being prepared. Head back to confirm your goal to
            generate it.
          </p>
          <div className="mt-6">
            <Button href="/start/goal" variant="primary" size="lg">
              Confirm Goal
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-10 divide-y divide-border border-y border-border">
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
                  {step.status === "completed"
                    ? "Completed"
                    : step.status === "current"
                      ? "Current"
                      : "Up next"}
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
                {step.description ? (
                  <span className="text-sm leading-6 text-secondary">
                    {step.description}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <Button href="/next" variant="primary" size="lg">
          Start Next Step
        </Button>
        <Link
          href="/progress"
          className="inline-flex h-11 items-center justify-center rounded-md border border-border px-5 text-xs font-semibold tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          View Progress
        </Link>
      </div>
    </div>
  );
}
