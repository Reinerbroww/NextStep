import { NextResponse } from "next/server";
import { transcribeAudio, parseJson } from "@/lib/ai";

type TranscribeResult = {
  text: string;
};

export async function POST(req: Request) {
  let audioBase64: string;
  let mimeType: string;
  try {
    const body = await req.json();
    audioBase64 = typeof body?.audio === "string" ? body.audio : "";
    mimeType = typeof body?.mimeType === "string" ? body.mimeType : "audio/wav";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!audioBase64) {
    return NextResponse.json({ error: "No audio was provided." }, { status: 400 });
  }

  if (audioBase64.length > 25_000_000) {
    return NextResponse.json(
      { error: "The recording is too large." },
      { status: 413 },
    );
  }

  try {
    const { text } = await transcribeAudio(audioBase64, mimeType);
    const result = parseJson<TranscribeResult>(text);
    return NextResponse.json({ text: result.text ?? "" });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "AI transcribe failed." },
      { status: 500 },
    );
  }
}