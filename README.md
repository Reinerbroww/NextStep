<div align="center">

# <span style="color:#2f6db5">Next</span><span style="color:#17a2a8">Step</span>

### <span style="color:#171716">Know what you want.</span> <span style="color:#676762">Know what to do.</span>

**NextStep** is an AI-powered web app that walks you from *confusion* to *clarity* — one calm, concrete step at a time.

<br />

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-API-4285f4?style=for-the-badge&logo=google&logoColor=white)

</div>

---

## 🌱 What is NextStep?

People get stuck not because they lack answers, but because they have **too many thoughts, options, and questions**. NextStep exists to cut through the noise:

> Tell us what's on your mind. We help you find the goal, build the plan, and tell you the **one** thing to do right now.

It is not a to-do list. It is not a chatbot. It is a **clarity engine**: from a messy head to a clear next step.

**Core philosophy** — `Confused → Understand → Clarify → Goal → Plan → Next Step → Progress`

---

## ✨ Features

| | Feature | What it does |
| :-: | --- | --- |
| 🎤 | **Text & Voice input** | Type your situation or *just talk*. Voice uses your browser's speech recognition first, and automatically falls back to **AI transcription (Gemini)** when the browser speech service is unreachable. |
| 🧠 | **Context & intent understanding** | The AI reads what's really going on, not just what you typed. |
| 💡 | **Goal discovery & clarification** | Goal already clear? It proposes one. Fuzzy? It asks a single focused question. |
| 🗺️ | **Action plan** | A tailored 3–5 step plan beginners can actually follow. |
| ➡️ | **Next step** | The exact thing to do *right now*, with an estimated time in minutes. Mark it done and the next step adapts. |
| 📊 | **Progress tracking** | Live progress with step counters and a clean goal-complete state. |
| 🌍 | **Follows your language** | Speaks **Bahasa Indonesia, English, Español, Français, Deutsch, 日本語, Português** — the AI detects the language you type in and answers in that language. UI ships with full **English / Bahasa Indonesia** translations. |
| 💾 | **Session persistence** | Every save is mirrored to PostgreSQL, so closing the browser never loses your flow. `/next` and `/progress` auto-restore your last session. |
| 🛡️ | **Resilient AI** | Automatic retries, timeouts, and model fallback (`gemini-3.6-flash` → `gemini-flash-latest` → `gemini-2.5-flash` → `gemini-3.5-flash`) so an overloaded model never stalls you. |

---

## 🧭 How it works

```
        🫥 Confused
            │
            ▼
        📝 "What's on your mind?"   ← type or speak
            │
            ▼
        🧠 AI understands context & intent
            │
            ▼
      Goal clear?  ──No──▶  ❓ AI asks ONE question → you answer → back up
            │
           Yes
            │
            ▼
   ✅ Confirm goal  →  🗺️ Action plan (3–5 steps)
            │
            ▼
   ➡️ Next step  →  "Mark as Done"  →  next step adapts
            │
            ▼
        📊 Progress  →  ⭐ Goal complete → new session
```

---

## ⚡ Quickstart

### 1. Install

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in your keys:

```env
DATABASE_URL="your-neon-postgresql-connection-string"
GEMINI_API_KEY="your-gemini-api-key"
GEMINI_MODEL="gemini-3.6-flash"
GEMINI_FALLBACK_MODELS="gemini-flash-latest,gemini-2.5-flash,gemini-3.5-flash"
```

| Variable | Required | Description |
| --- | :-: | --- |
| `GEMINI_API_KEY` | ✅ | Google AI Studio key used for every AI call and voice transcription |
| `DATABASE_URL` | ✅ | Neon (or any) PostgreSQL connection string |
| `GEMINI_MODEL` | ⬜ | Primary model (default `gemini-3.6-flash`) |
| `GEMINI_FALLBACK_MODELS` | ⬜ | Comma-separated fallbacks tried in order on overload |

### 3. Run

```bash
npm run dev          # start dev server → http://localhost:3000
npm run lint         # lint (eslint)
npm run build        # production build
npm run start        # serve production build
```

> 💡 Voice input needs a **secure context** — `localhost` works during development; a deployed site must be served over HTTPS.

---

## 🗄️ Database (PostgreSQL / Neon)

The schema lives in [`lib/schema.sql`](lib/schema.sql) and mirrors the source-of-truth in `docs/coldstart.md`.

```
User → Session → Goal → Action Plan → Progress
```

- **users** — who you are
- **sessions** — one "what's on your mind" share (`text` / `voice`)
- **goals** — `active` / `completed` / `archived`
- **action_plans** — ordered steps, `pending` → `in_progress` → `completed`
- **progress** — step completion tracking with timestamps

The app auto-creates a compact `nextstep_sessions` table on first use for lightweight session restore, while `lib/schema.sql` documents the full relational model ready for growth.

---

## 🛠️ Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | **Next.js 16** (App Router) |
| UI Library | **React 19** |
| Language | **TypeScript** |
| Styling | **Tailwind CSS 4** |
| Database | **PostgreSQL** via **Neon** (`@neondatabase/serverless`) |
| AI | **Google Gemini** (`generativelanguage.googleapis.com`) |
| Voice | Web Speech API + WAV recording → Gemini transcription fallback |

---

## 📁 Project Structure

```text
NextStep/
├── app/
│   ├── (app)/                # Main user flow pages
│   │   ├── start/            #   Input + goal clarification
│   │   ├── plan/             #   Action plan
│   │   ├── next/             #   "What should I do next?"
│   │   └── progress/         #   Progress tracking
│   ├── api/
│   │   ├── analyze/          #   AI context/intent + goal + clarifying question
│   │   ├── plan/             #   AI action plan
│   │   ├── next-step/        #   AI next step + minutes
│   │   ├── transcribe/       #   Voice audio → text (Gemini)
│   │   └── session/          #   Persist / restore sessions
│   ├── page.tsx              # Landing page
│   └── ...
├── components/               # Reusable UI (Spinner, VoiceInput, LanguageToggle...)
├── lib/                      # ai client, flow store, wav encoder, i18n, db, language detection
├── docs/                     # Product docs — the source of truth
└── public/
```

**API routes recap**

| Route | Method | Purpose |
| --- | :-: | --- |
| `/api/analyze` | POST | Understand input → goal or clarifying question |
| `/api/plan` | POST | Build a 3–5 step action plan |
| `/api/next-step` | POST | Generate the next concrete step + minutes |
| `/api/transcribe` | POST | `{ audio, mimeType }` → transcribed text |
| `/api/session` | POST/GET | Upsert latest flow / fetch last session |

---

## 🎨 Design System

**Structured Editorial Minimalism** — calm, focused, trustworthy. No shadows, no noise.

| Token | Hex |
| --- | --- |
| <span style="color:#2f6db5">Primary</span> | `#2f6db5` |
| <span style="color:#dce8f5">Primary soft</span> | `#dce8f5` |
| <span style="color:#f1f0eb">Background</span> | `#f1f0eb` |
| <span style="color:#171716">Foreground</span> | `#171716` |
| <span style="color:#676762">Secondary</span> | `#676762` |
| <span style="color:#969690">Muted</span> | `#969690` |
| <span style="color:#a33b2e">Danger</span> | `#a33b2e` |

Typography: **Inter**, clean hierarchy, generous whitespace, 44px touch targets.

---

## 📚 Documentation

Product decisions are locked in `docs/` — read these before changing scope:

- [`docs/coldstart.md`](docs/coldstart.md) — **single source of truth**
- `docs/prd.md`, `docs/user-flow.md`, `docs/user-persona.md`
- `docs/wireframe.md`, `docs/style-and-mood.md`, `docs/techstack.md`
- `docs/SetupTechStack.md`, `docs/databaseschema..md`

---

<div align="center">

> **"You don't need the whole plan. You just need to know what to do next."**

<br />

<span style="color:#2f6db5;font-weight:600">NextStep</span> — <span style="color:#676762">From confusion to clarity.</span>

</div>