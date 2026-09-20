import { NextResponse } from "next/server";
import { listHistory, clearHistory } from "@/lib/db";

export const maxDuration = 60;
export const runtime = "nodejs";

export async function GET() {
  try {
    const entries = await listHistory();
    return NextResponse.json({ entries });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Loading history failed." },
      { status: 503 },
    );
  }
}

export async function DELETE() {
  try {
    await clearHistory();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Clearing history failed." },
      { status: 503 },
    );
  }
}