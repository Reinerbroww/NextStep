"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import { DemoBanner, DemoToggle } from "@/components/DemoBanner";
import LanguageToggle from "@/components/LanguageToggle";
import { useTranslation } from "@/lib/i18n";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col">
      <DemoBanner />
      <header className="h-16 border-b border-border">
        <nav className="mx-auto flex h-full w-full max-w-[1200px] items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex h-12 items-center transition-opacity hover:opacity-80">
            <Image
              src="/logo.png"
              alt="NextStep"
              width={48}
              height={48}
              className="h-12 w-auto"
              priority
            />
          </Link>
          <div className="hidden items-center gap-8 text-sm text-secondary sm:flex">
            <a href="#how-it-works" className="transition-colors hover:text-primary">
              {t.nav.howItWorks}
            </a>
            <a href="/privacy" className="transition-colors hover:text-primary">
              {t.nav.privacy}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <Button href="/start" variant="primary" size="sm">
              {t.nav.startHere}
            </Button>
          </div>
        </nav>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="mx-auto w-full max-w-[720px] px-4 py-24 sm:px-6 sm:py-32">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            {t.landing.tagline}
          </p>
          <h1 className="mt-8 text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-6xl">
            {t.landing.heroTitle}
          </h1>
          <div className="mt-10">
            <Button href="/start" variant="primary" size="lg">
              {t.nav.startHere}
            </Button>
            <DemoToggle />
          </div>
        </section>

        <section
          id="product-demo"
          className="mx-auto w-full max-w-[720px] px-4 pb-24 sm:px-6"
        >
          <div className="divide-y divide-border border-y border-border">
            <div className="py-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                You
              </p>
              <p className="mt-3 text-xl font-medium leading-8 text-foreground">
                {t.landing.demoUser1}
              </p>
            </div>
            <div className="py-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                NextStep
              </p>
              <p className="mt-3 text-xl font-medium leading-8 text-foreground">
                {t.landing.demoNextstep1}
              </p>
            </div>
            <div className="py-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                You
              </p>
              <p className="mt-3 text-xl font-medium leading-8 text-foreground">
                {t.landing.demoUser2}
              </p>
            </div>
            <div className="py-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                NextStep
              </p>
              <p className="mt-3 text-xl font-medium leading-8 text-foreground">
                {t.landing.demoNextstep2}
              </p>
              <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-muted">
                {t.landing.demoYourGoal}
              </p>
              <p className="mt-3 text-2xl font-bold leading-9 text-foreground">
                {t.landing.demoGoalValue}
              </p>
              <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-muted">
                {t.landing.demoNextStep}
              </p>
              <p className="mt-3 text-2xl font-bold leading-9 text-foreground">
                {t.landing.demoStepValue}
              </p>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="mx-auto w-full max-w-[720px] px-4 pb-24 sm:px-6"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            {t.landing.howItWorksTitle}
          </p>
          <div className="mt-6 divide-y divide-border border-t border-border">
            <div className="flex items-baseline gap-6 py-8">
              <span className="text-sm font-semibold text-primary">01</span>
              <div>
                <p className="text-2xl font-bold tracking-tight text-foreground">
                  {t.landing.step1Title}
                </p>
                <p className="mt-2 max-w-[480px] text-base leading-6 text-secondary">
                  {t.landing.step1Desc}
                </p>
              </div>
            </div>
            <div className="flex items-baseline gap-6 py-8">
              <span className="text-sm font-semibold text-primary">02</span>
              <div>
                <p className="text-2xl font-bold tracking-tight text-foreground">
                  {t.landing.step2Title}
                </p>
                <p className="mt-2 max-w-[480px] text-base leading-6 text-secondary">
                  {t.landing.step2Desc}
                </p>
              </div>
            </div>
            <div className="flex items-baseline gap-6 py-8">
              <span className="text-sm font-semibold text-primary">03</span>
              <div>
                <p className="text-2xl font-bold tracking-tight text-foreground">
                  {t.landing.step3Title}
                </p>
                <p className="mt-2 max-w-[480px] text-base leading-6 text-secondary">
                  {t.landing.step3Desc}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[720px] px-4 pb-32 text-left sm:px-6">
          <p className="max-w-[520px] text-2xl font-bold leading-9 tracking-tight text-foreground sm:text-3xl">
            {t.landing.ctaTitle}
          </p>
          <p className="mt-4 max-w-[480px] text-base leading-6 text-secondary">
            {t.landing.ctaDesc}
          </p>
          <div className="mt-8">
            <Button href="/start" variant="primary" size="lg">
              {t.nav.startHere}
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-secondary sm:flex-row sm:px-6">
          <span>© NextStep</span>
          <nav className="flex items-center gap-6">
            <a href="/terms" className="transition-colors hover:text-primary">
              {t.nav.terms}
            </a>
            <a href="/privacy" className="transition-colors hover:text-primary">
              {t.nav.privacy}
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
