import Link from "next/link";
import Button from "@/components/Button";

export default function PrivacyPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="h-16 border-b border-border">
        <nav className="mx-auto flex h-full w-full max-w-[1200px] items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-base font-bold text-foreground">
            <span
              aria-hidden="true"
              className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-primary text-white"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12l14 0" />
                <path d="M13 6l6 6-6 6" />
              </svg>
            </span>
            NextStep
          </Link>
          <Button href="/start" variant="primary" size="sm">
            Start Exploring
          </Button>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-[720px] flex-1 px-4 py-14 sm:px-6">
        <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted">Last updated: 4 September 2026</p>

        <div className="mt-8 space-y-8 text-base leading-7 text-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground">
              1. What We Collect
            </h2>
            <p className="mt-2 text-muted">
              When you use NextStep, we collect the text or voice input you
              share, along with basic account information such as your email
              and name if you create an account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              2. How We Use Your Data
            </h2>
            <p className="mt-2 text-muted">
              We use your input to understand your situation, clarify your
              goal, build your action plan, and track your progress. We process
              your data only for the purpose of providing the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              3. AI Processing
            </h2>
            <p className="mt-2 text-muted">
              Your input may be sent to an AI service to generate suggestions.
              We process this information to deliver responses and do not sell
              your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              4. Data Storage
            </h2>
            <p className="mt-2 text-muted">
              Your sessions, goals, action plans, and progress are stored in a
              secure database. We keep your data only as long as needed to
              provide the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              5. Data Security
            </h2>
            <p className="mt-2 text-muted">
              We use industry-standard measures to protect your data. However,
              no method of transmission over the internet is completely secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              6. Your Rights
            </h2>
            <p className="mt-2 text-muted">
              You may request access to, correction of, or deletion of your
              personal data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              7. Contact
            </h2>
            <p className="mt-2 text-muted">
              If you have questions about this Privacy Policy, please contact
              the NextStep team.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
