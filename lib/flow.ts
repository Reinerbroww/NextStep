"use client";

import { useSyncExternalStore } from "react";

export type PlanStep = {
  number: string;
  title: string;
  description: string;
  status: "completed" | "current" | "up-next";
  // AI guidance generated while this step was active, kept forever so the
  // detail can be reopened as-is even after the step is done.
  nextStep?: string | null;
  nextStepMinutes?: string | null;
};

export type FlowState = {
  input: string;
  context: string;
  goal: string;
  isGoalClear: boolean;
  clarifyingQuestion: string;
  plan: PlanStep[] | null;
  nextStep: string | null;
  nextStepMinutes: string | null;
  confidenceScore?: number;
  clarifyCount?: number;
  lastClarifyingQuestion?: string;
};

const KEY = "nextstep-flow";
const SESSION_KEY = "nextstep-session-id";
const CLEARED_KEY = "nextstep-flow-cleared";

let cached: FlowState | null = null;
let cachedValid = false;
const listeners = new Set<() => void>();

function invalidateCache(): void {
  cached = null;
  cachedValid = false;
}

function emit(): void {
  invalidateCache();
  listeners.forEach((cb) => cb());
}

// Re-pins a restored flow to its original DB row so edits keep updating it.
export function adoptSession(sessionKey: string): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(SESSION_KEY, sessionKey);
}

// A stable id for this browser tab so every save updates the same DB row.
function sessionId(): string {
  const existing = window.sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const random =
    typeof window.crypto?.randomUUID === "function"
      ? window.crypto.randomUUID()
      : `s-${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
  window.sessionStorage.setItem(SESSION_KEY, random);
  return random;
}

// Best-effort save to Postgres so the session survives a browser restart.
async function persistFlow(state: FlowState): Promise<void> {
  try {
    await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionKey: sessionId(), flow: state }),
    });
  } catch {
    // Saving is best-effort; the flow still lives in sessionStorage.
  }
}

export function loadFlow(): FlowState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as FlowState) : null;
  } catch {
    return null;
  }
}

export function saveFlow(state: FlowState): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(KEY, JSON.stringify(state));
  window.sessionStorage.removeItem(CLEARED_KEY);
  void persistFlow(state);
  emit();
}

export function clearFlow(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(KEY);
  window.sessionStorage.removeItem(SESSION_KEY);
  // Remember that the user asked to start fresh so /next and /progress do not
  // silently restore the last session from the database.
  window.sessionStorage.setItem(CLEARED_KEY, "1");
  emit();
}

export function wasFlowCleared(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(CLEARED_KEY) === "1";
  } catch {
    return true;
  }
}

export function updateFlow(patch: Partial<FlowState>): FlowState | null {
  const current = loadFlow();
  if (!current) return null;
  const next: FlowState = { ...current, ...patch };
  saveFlow(next);
  return next;
}

export function currentStepOf(state: FlowState): PlanStep | undefined {
  return state.plan?.find((s) => s.status === "current");
}

export function isGoalComplete(state: FlowState): boolean {
  const plan = state.plan ?? [];
  return plan.length > 0 && plan.every((s) => s.status === "completed");
}

// Marks the current step as completed, advances the next step to "current",
// and points the live guidance at the new step's saved answer (if any).
// Completed steps keep their saved detail so it can be reopened later.
export function completeCurrentStep(): FlowState | null {
  const current = loadFlow();
  if (!current) return null;
  const plan = current.plan ? current.plan.map((s) => ({ ...s })) : null;
  let nextCurrent: PlanStep | undefined;
  if (plan) {
    const idx = plan.findIndex((s) => s.status === "current");
    if (idx >= 0) {
      plan[idx].status = "completed";
      if (idx + 1 < plan.length) {
        plan[idx + 1].status = "current";
        nextCurrent = plan[idx + 1];
      }
    }
  }
  const next: FlowState = {
    ...current,
    plan,
    nextStep: nextCurrent?.nextStep ?? null,
    nextStepMinutes: nextCurrent?.nextStepMinutes ?? null,
  };
  saveFlow(next);
  return next;
}

// Stores the AI guidance on the plan step itself (so it is saved to the
// database with the flow) and mirrors it to the live fields when it belongs
// to the step being worked on right now.
export function attachStepGuidance(
  state: FlowState,
  stepNumber: string | undefined,
  nextStep: string,
  nextStepMinutes: string,
): FlowState {
  const current = currentStepOf(state);
  const isCurrent = Boolean(current && stepNumber === current.number);
  const plan =
    state.plan?.map((s) =>
      s.number === stepNumber ? { ...s, nextStep, nextStepMinutes } : s,
    ) ?? null;
  return {
    ...state,
    plan,
    nextStep: isCurrent || !current ? nextStep : state.nextStep,
    nextStepMinutes: isCurrent || !current ? nextStepMinutes : state.nextStepMinutes,
  };
}

function getSnapshot(): FlowState | null {
  if (!cachedValid) {
    cached = loadFlow();
    cachedValid = true;
  }
  return cached;
}

function getServerSnapshot(): FlowState | null {
  return null;
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

export function useFlow(): FlowState | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
