import "server-only";
import { Pool } from "@neondatabase/serverless";

// Uses the DATABASE_URL from .env.local (a Neon Postgres connection string).
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

let schemaReady: Promise<void> | null = null;

function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = pool
      .query(`
        CREATE TABLE IF NOT EXISTS nextstep_sessions (
          session_key TEXT PRIMARY KEY,
          flow JSONB NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
        CREATE TABLE IF NOT EXISTS nextstep_history (
          id BIGSERIAL PRIMARY KEY,
          session_key TEXT NOT NULL,
          goal TEXT NOT NULL,
          next_step TEXT,
          current_step INTEGER NOT NULL DEFAULT 0,
          total_steps INTEGER NOT NULL DEFAULT 0,
          completed_steps INTEGER NOT NULL DEFAULT 0,
          is_goal_complete BOOLEAN NOT NULL DEFAULT false,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
        CREATE UNIQUE INDEX IF NOT EXISTS nextstep_history_session_key_idx
          ON nextstep_history (session_key);
      `)
      .then(() => undefined)
      .catch((err) => {
        schemaReady = null;
        throw err;
      });
  }
  return schemaReady;
}

export async function upsertSession(
  sessionKey: string,
  flow: unknown,
): Promise<void> {
  await ensureSchema();
  await pool.query(
    `INSERT INTO nextstep_sessions (session_key, flow, updated_at)
     VALUES ($1, $2::jsonb, now())
     ON CONFLICT (session_key)
     DO UPDATE SET flow = EXCLUDED.flow, updated_at = now()`,
    [sessionKey, JSON.stringify(flow)],
  );
}

export async function latestSession(sessionKey?: string): Promise<{
  sessionKey: string;
  flow: unknown;
} | null> {
  await ensureSchema();
  const res = sessionKey
    ? await pool.query(
        `SELECT session_key, flow FROM nextstep_sessions WHERE session_key = $1`,
        [sessionKey],
      )
    : await pool.query(
        `SELECT session_key, flow FROM nextstep_sessions ORDER BY updated_at DESC LIMIT 1`,
      );
  if (!res.rows[0]) return null;
  return { sessionKey: res.rows[0].session_key, flow: res.rows[0].flow };
}

export type HistoryEntry = {
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

type FlowSummary = {
  goal: string;
  nextStep: string;
  plan: { status?: string }[] | null;
};

// Records a compressed snapshot of a session once it becomes actionable
// (a plan or a next step exists). Keyed by session, so one row per session.
export async function upsertHistory(
  sessionKey: string,
  flow: unknown,
): Promise<void> {
  const f = (flow ?? {}) as FlowSummary;
  const goal = typeof f.goal === "string" ? f.goal.trim() : "";
  const nextStep = typeof f.nextStep === "string" ? f.nextStep.trim() : "";
  const plan = Array.isArray(f.plan) ? f.plan.filter(Boolean) : null;

  if (!goal || (!plan && !nextStep)) return;

  const totalSteps = plan?.length ?? 0;
  const completedSteps = plan?.filter((s) => s?.status === "completed").length ?? 0;
  const currentIndex = plan?.findIndex((s) => s?.status === "current") ?? -1;
  const currentStep = currentIndex >= 0 ? currentIndex + 1 : 0;
  const isGoalComplete = totalSteps > 0 && completedSteps === totalSteps;

  await ensureSchema();
  await pool.query(
    `INSERT INTO nextstep_history
       (session_key, goal, next_step, current_step, total_steps, completed_steps, is_goal_complete, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, now())
     ON CONFLICT (session_key)
     DO UPDATE SET
       goal = EXCLUDED.goal,
       next_step = EXCLUDED.next_step,
       current_step = EXCLUDED.current_step,
       total_steps = EXCLUDED.total_steps,
       completed_steps = EXCLUDED.completed_steps,
       is_goal_complete = EXCLUDED.is_goal_complete,
       updated_at = now()`,
    [
      sessionKey,
      goal,
      nextStep || null,
      currentStep,
      totalSteps,
      completedSteps,
      isGoalComplete,
    ],
  );
}

export async function listHistory(limit = 30): Promise<HistoryEntry[]> {
  await ensureSchema();
  const res = await pool.query(
    `SELECT id, session_key, goal, next_step, current_step, total_steps,
            completed_steps, is_goal_complete, updated_at
     FROM nextstep_history
     ORDER BY updated_at DESC
     LIMIT $1`,
    [limit],
  );
  return res.rows.map((r) => ({
    id: Number(r.id),
    sessionKey: String(r.session_key),
    goal: String(r.goal),
    nextStep: r.next_step ? String(r.next_step) : null,
    currentStep: Number(r.current_step),
    totalSteps: Number(r.total_steps),
    completedSteps: Number(r.completed_steps),
    isGoalComplete: Boolean(r.is_goal_complete),
    updatedAt:
      typeof r.updated_at?.toISOString === "function"
        ? r.updated_at.toISOString()
        : String(r.updated_at),
  }));
}

export async function clearHistory(): Promise<void> {
  await ensureSchema();
  await pool.query(`DELETE FROM nextstep_history`);
}