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
        )
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

export async function latestSession(): Promise<{
  sessionKey: string;
  flow: unknown;
} | null> {
  await ensureSchema();
  const res = await pool.query(
    `SELECT session_key, flow FROM nextstep_sessions ORDER BY updated_at DESC LIMIT 1`,
  );
  if (!res.rows[0]) return null;
  return { sessionKey: res.rows[0].session_key, flow: res.rows[0].flow };
}