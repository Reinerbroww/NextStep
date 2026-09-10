"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslation, translations } from "@/lib/i18n";

const STORAGE_KEY = "nextstep-demo";

type DemoContextType = {
  demo: boolean;
  setDemoMode: (on: boolean) => void;
};

const DemoContext = createContext<DemoContextType>({
  demo: false,
  setDemoMode: () => {},
});

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    let on = false;
    try {
      on = localStorage.getItem(STORAGE_KEY) === "on";
    } catch {
      // storage unavailable
    }
    if (on) {
      queueMicrotask(() => setDemo(true));
    }
  }, []);

  const setDemoMode = (on: boolean) => {
    setDemo(on);
    try {
      localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
    } catch {
      // ignore
    }
  };

  return (
    <DemoContext.Provider value={{ demo, setDemoMode }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemoMode() {
  return useContext(DemoContext);
}

function demoHintFor(pathname: string, t: typeof translations.en): string {
  if (pathname === "/") return t.demo.landing;
  if (pathname.startsWith("/start/goal")) return t.demo.goal;
  if (pathname.startsWith("/start")) return t.demo.start;
  if (pathname.startsWith("/plan")) return t.demo.plan;
  if (pathname.startsWith("/next")) return t.demo.next;
  if (pathname.startsWith("/progress")) return t.demo.progress;
  return t.demo.default;
}

export function DemoBanner() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { demo, setDemoMode } = useDemoMode();

  if (!demo) return null;

  return (
    <div className="border-b border-border bg-primary-soft">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            {t.demo.title}
          </p>
          <p className="mt-1 text-sm leading-6 text-foreground">
            {demoHintFor(pathname, t)}
          </p>
        </div>
        <button
          onClick={() => setDemoMode(false)}
          className="min-h-11 shrink-0 rounded-[4px] bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          {t.demo.exit}
        </button>
      </div>
    </div>
  );
}

export function DemoToggle() {
  const { t } = useTranslation();
  const { demo, setDemoMode } = useDemoMode();

  return (
    <button
      onClick={() => setDemoMode(!demo)}
      className="mt-5 text-sm text-secondary underline underline-offset-4 transition-colors hover:text-primary"
    >
      {demo ? t.demo.hideTour : t.demo.showTour}
    </button>
  );
}