import { NextResponse } from "next/server";
import { generateFromPrompt, parseJson } from "@/lib/ai";
import { detectLanguage, languageCodeToName } from "@/lib/language";

type NextStepResult = {
  nextStep: string;
  minutes: string;
};

const PROMPT = (
  goal: string,
  steps: string,
  currentStep: string,
  languageInstruction: string,
) => `You are NextStep, a calm AI that gives people ONE concrete next step.

The user's goal is: ${goal}

Their plan steps are:
${steps}

The step they are working on right now is: ${currentStep || "(not specified)"}

Tell them exactly what to do RIGHT NOW to move forward on that current step. Be specific and actionable. Keep it to one sentence. Also give a rough estimated time in minutes.

${languageInstruction}

Respond with strict JSON only:
{
  "nextStep": "The single concrete next step.",
  "minutes": "e.g. 20"
}`;

export async function POST(req: Request) {
  let goal: string;
  let steps: string[] = [];
  let currentStep: string = "";
  let language: string = "en";
  try {
    const body = await req.json();
    goal = typeof body?.goal === "string" ? body.goal.trim() : "";
    steps = Array.isArray(body?.steps) ? body.steps.map(String) : [];
    currentStep =
      typeof body?.currentStep === "string" ? body.currentStep.trim() : "";
    language = typeof body?.language === "string" ? body.language : "en";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!goal) {
    return NextResponse.json({ error: "A goal is required." }, { status: 400 });
  }

  const stepsText =
    steps.length > 0 ? steps.join("\n") : "(No steps provided yet.)";

  // The goal and plan are written in the user's language, so detect from them.
  const detected = detectLanguage(goal) ?? detectLanguage(steps.join(" "));
  const languageName = detected ?? languageCodeToName(language);
  const languageInstruction = detected
    ? `IMPORTANT LANGUAGE INSTRUCTION: The user's goal is written in ${detected}. Write 'nextStep' in natural, fluent ${detected}.`
    : languageName
      ? `IMPORTANT LANGUAGE INSTRUCTION: Write 'nextStep' in natural, fluent ${languageName}.`
      : "IMPORTANT LANGUAGE INSTRUCTION: Write 'nextStep' in the SAME LANGUAGE as the goal and its steps above.";

  try {
    const { text } = await generateFromPrompt(
      PROMPT(goal, stepsText, currentStep, languageInstruction),
    );
    const result = parseJson<NextStepResult>(text);
    return NextResponse.json({
      nextStep: result.nextStep ?? "",
      minutes: result.minutes ?? "",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "AI request failed." },
      { status: 500 },
    );
  }
}
