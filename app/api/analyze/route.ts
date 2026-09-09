import { NextResponse } from "next/server";
import { generateFromPrompt, parseJson } from "@/lib/ai";
import { detectLanguage, languageCodeToName } from "@/lib/language";

type AnalyzeResult = {
  context: string;
  isGoalClear: boolean;
  goal: string;
  clarifyingQuestion: string;
};

const PROMPT = (
  input: string,
  languageInstruction: string,
) => `You are NextStep, a calm AI that helps people move from confusion to clarity.

The user shares what's on their mind. Your job:
1. Understand their situation and intent.
2. Decide whether their goal is already clear enough to act on.
3. If clear, propose a single concise goal. If not clear, ask ONE focused clarifying question.

${languageInstruction}

Respond with strict JSON only:
{
  "context": "A 1-2 sentence summary of what the user is going through and what they likely want.",
  "isGoalClear": true or false,
  "goal": "a concise goal statement if clear, otherwise empty string",
  "clarifyingQuestion": "one focused question if not clear, otherwise empty string"
}

User input: ${input}`;

export async function POST(req: Request) {
  let input: string;
  let language: string = "en";
  try {
    const body = await req.json();
    input = typeof body?.input === "string" ? body.input.trim() : "";
    language = typeof body?.language === "string" ? body.language : "en";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!input) {
    return NextResponse.json({ error: "Please share something first." }, { status: 400 });
  }

  // Answer in the language the user actually wrote in, falling back to the
  // UI language (en/id) only when detection is uncertain.
  const detected = detectLanguage(input);
  const languageName = detected ?? languageCodeToName(language);
  const languageInstruction = detected
    ? `IMPORTANT LANGUAGE INSTRUCTION: The user is writing in ${detected}. Write 'context', 'goal', and 'clarifyingQuestion' in natural, fluent ${detected}.`
    : languageName
      ? `IMPORTANT LANGUAGE INSTRUCTION: The user is likely writing in ${languageName}. Write 'context', 'goal', and 'clarifyingQuestion' in natural, fluent ${languageName}.`
      : "IMPORTANT LANGUAGE INSTRUCTION: Write 'context', 'goal', and 'clarifyingQuestion' in the SAME LANGUAGE as the user's input below.";

  try {
    const { text } = await generateFromPrompt(PROMPT(input, languageInstruction));
    const result = parseJson<AnalyzeResult>(text);
    return NextResponse.json({
      context: result.context ?? "",
      isGoalClear: Boolean(result.isGoalClear),
      goal: result.goal ?? "",
      clarifyingQuestion: result.clarifyingQuestion ?? "",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "AI request failed." },
      { status: 500 },
    );
  }
}
