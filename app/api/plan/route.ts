import { NextResponse } from "next/server";
import { generateFromPrompt, parseJson } from "@/lib/ai";
import { detectLanguage, languageCodeToName } from "@/lib/language";

// Gemini calls can take 10-20s; keep the function below Vercel's Hobby cap.
export const maxDuration = 60;
export const runtime = "nodejs";

type PlanStep = {
  number: string;
  title: string;
  description: string;
};

type PlanResult = {
  steps: PlanStep[];
};

const PROMPT = (goal: string, languageInstruction: string) => `You are NextStep, a calm AI that turns a clear goal into a practical plan.

Create an action plan for this goal. Break it into 3-5 concrete, sequential steps a beginner can actually follow. Each step should have a short title and a one-line description.

${languageInstruction}

Respond with strict JSON only:
{
  "steps": [
    { "number": "01", "title": "Step title", "description": "One-line description" }
  ]
}

Goal: ${goal}`;

export async function POST(req: Request) {
  let goal: string;
  let language: string = "en";
  try {
    const body = await req.json();
    goal = typeof body?.goal === "string" ? body.goal.trim() : "";
    language = typeof body?.language === "string" ? body.language : "en";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!goal) {
    return NextResponse.json({ error: "A goal is required." }, { status: 400 });
  }

  // The goal is written in the user's language, so detect from it directly.
  const detected = detectLanguage(goal);
  const languageName = detected ?? languageCodeToName(language);
  const languageInstruction = detected
    ? `IMPORTANT LANGUAGE INSTRUCTION: The goal is written in ${detected}. Write every step title and description in natural, fluent ${detected}.`
    : languageName
      ? `IMPORTANT LANGUAGE INSTRUCTION: Write every step title and description in natural, fluent ${languageName}.`
      : "IMPORTANT LANGUAGE INSTRUCTION: Write every step title and description in the SAME LANGUAGE as the goal below.";
  const isIndonesian = languageName === "Bahasa Indonesia";

  try {
    const { text } = await generateFromPrompt(PROMPT(goal, languageInstruction));
    const result = parseJson<PlanResult>(text);
    let steps: PlanStep[] = [];
    if (Array.isArray(result.steps) && result.steps.length > 0) {
      steps = result.steps.map((s, i) => ({
        number: String(i + 1).padStart(2, "0"),
        title: s.title || (isIndonesian ? `Langkah ${i + 1}` : `Step ${i + 1}`),
        description: s.description || "",
      }));
    } else {
      // Fallback if AI produced plain text or unstructured JSON
      steps = [
        {
          number: "01",
          title: isIndonesian ? "Pelajari dasar-dasar" : "Learn the basics",
          description: goal,
        },
      ];
    }
    return NextResponse.json({ steps });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "AI request failed." },
      { status: 500 },
    );
  }
}
