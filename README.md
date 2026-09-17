<div align="center">

# NextStep

### College of Applied Artificial Intelligence — Official Repository

**Motto: *Know what you want. Know what to do.***

</div>

---

## Institutional Statement

NextStep is an applied research program of the College of Applied Artificial Intelligence. It is dedicated to a single proposition: *clarity precedes action*. Advised by a large language model, the program guides an individual from unresolved confusion to a defined objective, and from that objective to one concrete, immediately actionable step.

This repository contains the complete academic record of the program — its curriculum, its technical infrastructure, its admissions procedure, and its standing design conventions.

---

## Mission Statement

The program exists to serve individuals who are not lacking in answers, but who are burdened by an excess of options. NextStep does not present itself as a productivity instrument or a conversational agent. It operates as a **clarity engine**: it receives an unsettled mind as input and produces, as output, a single well-defined next step.

> Left to its own devices, the mind assembles questions faster than it answers them. The function of this program is to interrupt that process at an acceptable rate of one step per session.

---

## Abstract

- **Problem.** Uncertainty about what to pursue leads to inaction.
- **Objective.** Transform an unstructured expression of intent into (1) a confirmed goal, (2) a short course of action, and (3) a specific next step with an estimated duration.
- **Method.** A staged dialogue model — Intake, Understanding, Clarification, Goal Confirmation, Planning, Execution, and Progress — overseen by an AI advisor.
- **Result.** The program is delivered as a web application supporting written and spoken input, multilingual advising, durable session records, and resilient AI service integration.

---

## Program Methodology

The advising model follows a fixed academic sequence. Each stage qualifies as a prerequisite for the next.

```
Stage I      Intake                The student shares, in writing or by voice, what is on their mind.
Stage II     Understanding         The AI advisor summarizes context and intent.
Stage III    Clarification         Where the objective is unclear, the advisor asks a single focused
                                   question — at most five per session, after which a direction is
                                   determined — or, should the direction be disputed, returns to the
                                   last question posed.
Stage IV     Goal Confirmation     A proposed goal is presented for the student's approval and edit.
Stage V      Planning              A course of 3–5 steps is drafted, ordered for a beginner.
Stage VI     Execution             One next step is advanced, with an estimated completion time.
Stage VII    Progress              Completing a step advances the course; the program adapts.
```

---

## Curriculum

The following offerings comprise the program's core instruction. Each is delivered in the same calm, focused register.

| Offering | Description |
| --- | --- |
| Text and Voice Intake | Students may type or speak. Speech recognition is attempted through the browser's native service, with automatic recourse to AI transcription (Gemini) should the native service be unavailable. |
| Context and Intent Understanding | The advisor interprets underlying intent rather than surface wording. |
| Goal Discovery and Clarification | A clear objective yields a proposed goal; an unclear objective yields one focused question. |
| Action Planning | A tailored course of 3–5 steps, appropriate for a practitioner of any level. |
| Next-Step Guidance | The precise action to be taken immediately, together with an estimated duration in minutes. Completed steps advance the course. |
| Progress Records | Step completion is tracked, with explicit goal-complete states and session counters. |
| Multilingual Instruction | Advising is conducted in the language of the student. Dialects supported include English, Bahasa Indonesia, Español, Français, Deutsch, 日本語, and Português; the interface is fully translated into English and Bahasa Indonesia. |
| Session Persistence | Every record is mirrored to a PostgreSQL database, such that a closed browser does not forfeit the student's standing. `/next` and `/progress` restore the last session automatically. |
| Service Resilience | Requests are attempted against a primary AI model with automatic retries, exponential backoff, and a cascading fallback through verified secondary models (`gemini-3.6-flash` → `gemini-3.5-flash` → `gemini-3.5-flash-lite` …) so that service interruption never suspends the student. |

---

## Admissions

### Prerequisites

- Node.js and npm installed on the applicant's machine.
- A Google AI Studio API key.
- (Optional) A PostgreSQL connection string; the Neon serverless offering is recommended.

### Step 1 — Installation

```bash
npm install
```

### Step 2 — Configuration

Copy the standing template `.env.example` to `.env.local` and furnish the following variables:

```env
DATABASE_URL="your-neon-postgresql-connection-string"
GEMINI_API_KEY="your-gemini-api-key"
GEMINI_MODEL="gemini-3.6-flash"
GEMINI_FALLBACK_MODELS="gemini-3.5-flash,gemini-3.5-flash-lite,gemini-3.1-flash-lite,gemini-flash-lite-latest,gemini-3-flash-preview"
```

| Variable | Required | Purpose |
| --- | :-: | --- |
| `GEMINI_API_KEY` | Yes | Google AI Studio key employed for every AI request and voice transcription. |
| `DATABASE_URL` | Yes | PostgreSQL connection string (Neon or equivalent). |
| `GEMINI_MODEL` | No | Primary model; defaults to `gemini-3.6-flash`. |
| `GEMINI_FALLBACK_MODELS` | No | Comma-separated reserve models, tried in sequence upon overload. |

### Step 3 — Commencement

```bash
npm run dev          # Begin the development server → http://localhost:3000
npm run lint         # Enforce the house style (ESLint)
npm run build        # Compile a production build
npm run start        # Serve the production build
```

Voice intake requires a secure context (HTTPS). `localhost` satisfies this during development; a published installation must be served over a signed connection.

---

## Office of Records (Data Infrastructure)

The relational schema is maintained in [`lib/schema.sql`](lib/schema.sql) and documented thoroughly in `docs/coldstart.md`.

```
Student → Session → Goal → Action Plan → Progress
```

- **users** — the identity of the applicant.
- **sessions** — a single statement of "what is on your mind," by text or by voice.
- **goals** — a course objective with states `active`, `completed`, and `archived`.
- **action_plans** — ordered steps progressing `pending` → `in_progress` → `completed`.
- **progress** — the record of step completion, with timestamps.

On first use, the application provisions a compact `nextstep_sessions` table for the lightweight restoration of sessions; `lib/schema.sql` preserves the full relational model for subsequent growth.

---

## Facilities and Technology

| Division | Standing |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Interface Library | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL via Neon (`@neondatabase/serverless`) |
| AI Advisory | Google Gemini (`generativelanguage.googleapis.com`) |
| Voice | Web Speech API, with WAV recording and Gemini transcription as reserve |

---

## Institutional Organization

```text
NextStep/
├── app/
│   ├── (app)/                # The principal user journey
│   │   ├── start/            #   Intake and clarification
│   │   ├── plan/             #   Course planning
│   │   ├── next/             #   Next-step advisement
│   │   └── progress/         #   Progress records
│   ├── api/
│   │   ├── analyze/          #   Context, goal, and clarifying question
│   │   ├── plan/             #   Course of action
│   │   ├── next-step/        #   Next step and its duration
│   │   ├── transcribe/       #   Voice audio → text (Gemini)
│   │   └── session/          #   Persist and restore sessions
│   ├── page.tsx              # The public landing page
│   └── ...
├── components/               # Reusable interface elements
├── lib/                      # AI client, flow store, WAV encoder, i18n, database, language detection
├── docs/                     # Official program records
└── public/
```

### Public Course Endpoints

| Endpoint | Method | Purpose |
| --- | :-: | --- |
| `/api/analyze` | POST | Interpret input; return a goal or a clarifying question. |
| `/api/plan` | POST | Compile a 3–5 step action plan. |
| `/api/next-step` | POST | Generate the immediate next step and its duration. |
| `/api/transcribe` | POST | Convert `{ audio, mimeType }` to transcribed text. |
| `/api/session` | POST / GET | Upsert the latest flow; fetch the last session. |

---

## Institutional Visual Identity

The program's design conventions are governed by **Structured Editorial Minimalism** — a calm, focused, and trustworthy appearance, free of decorative shadow and noise.

| Token | Hex |
| --- | --- |
| Primary | `#2f6db5` |
| Primary soft | `#dce8f5` |
| Background | `#f1f0eb` |
| Foreground | `#171716` |
| Secondary | `#676762` |
| Muted | `#969690` |
| Danger | `#a33b2e` |

Typography: **Inter**, clear hierarchy, generous whitespace, and 44px touch targets for accessibility.

---

## Official Records

Decisions governing the program are preserved in `docs/` and should be consulted before any change of scope:

- [`docs/coldstart.md`](docs/coldstart.md) — the standing authority
- `docs/prd.md`, `docs/user-flow.md`, `docs/user-persona.md`
- `docs/wireframe.md`, `docs/style-and-mood.md`, `docs/techstack.md`
- `docs/SetupTechStack.md`, `docs/databaseschema..md`

---

<div align="center">

> *"You don't need the whole plan. You just need to know what to do next."*

**NextStep** — *From confusion to clarity.*

</div>