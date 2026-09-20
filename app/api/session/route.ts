import { NextResponse } from "next/server";
import { upsertSession, latestSession, upsertHistory } from "@/lib/db";

export async function POST(req: Request) {
  let sessionKey: string;
  let flow: unknown;
  try {
    const body = await req.json();
    sessionKey = typeof body?.sessionKey === "string" ? body.sessionKey : "";
    flow = body?.flow;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  if (!sessionKey || !flow) {
    return NextResponse.json(
      { error: "sessionKey and flow are required." },
      { status: 400 },
    );
  }

  try {
    await upsertSession(sessionKey, flow);
    await upsertHistory(sessionKey, flow);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Saving failed." },
      { status: 503 },
    );
  }
}

export async function GET(req: Request) {
  const key = new URL(req.url).searchParams.get("key") ?? undefined;
  try {
    const row = await latestSession(key);
    return NextResponse.json(
      row ?? { sessionKey: null, flow: null },
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Loading failed." },
      { status: 503 },
    );
  }
}