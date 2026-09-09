"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadFlow } from "@/lib/flow";
import { useTranslation } from "@/lib/i18n";

export default function UnderstandingPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);

  const stages = [
    t.understanding.stage0,
    t.understanding.stage1,
    t.understanding.stage2,
  ];

  useEffect(() => {
    const flow = loadFlow();
    if (!flow?.input) {
      router.replace("/start");
      return;
    }

    const stageTimer = setInterval(() => {
      setIndex((i) => {
        const next = i + 1;
        if (next >= stages.length) {
          clearInterval(stageTimer);
          setTimeout(() => router.replace("/start/goal"), 380);
        }
        return next;
      });
    }, 380);

    return () => clearInterval(stageTimer);
  }, [router, stages.length]);

  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-1 flex-col items-center justify-center py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted">
        NextStep
      </p>
      <p className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
        {stages[index]}
      </p>
      <div className="mt-8 flex items-center gap-1.5" aria-hidden="true">
        {stages.map((s, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${
              i <= index ? "bg-primary" : "bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
