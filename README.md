# NextStep

**Know what you want. Know what to do.**

NextStep is an AI-powered web app that helps people turn uncertainty into a clear goal, a practical plan, and the next step they can take.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- PostgreSQL (Neon)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```env
DATABASE_URL="your-neon-postgresql-connection-string"
AI_API_KEY="your-ai-api-key"
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Database

The PostgreSQL schema is defined in `lib/schema.sql`. Run it against your Neon database to create the required tables.

## Project Structure

```text
NextStep/
├── app/          # Next.js App Router routes
├── components/   # Reusable React components
├── lib/          # Utilities and database setup
├── public/       # Static assets
└── docs/         # Product documentation (source of truth)
```

## Documentation

Product requirements and design decisions live in `docs/`. See `docs/coldstart.md` for the single source of truth.
