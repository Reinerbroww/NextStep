"use client";

import Link from "next/link";
import Button from "@/components/Button";
import LanguageToggle from "@/components/LanguageToggle";
import { useTranslation } from "@/lib/i18n";

type NavLinkProps = {
  href: string;
  label: string;
  active?: boolean;
};

function NavLink({ href, label, active }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`text-sm transition-colors hover:text-primary ${
        active ? "font-semibold text-primary" : "text-secondary"
      }`}
    >
      {label}
    </Link>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="h-16 border-b border-border">
        <nav className="mx-auto flex h-full w-full max-w-[1200px] items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="text-base font-bold tracking-tight text-foreground"
          >
            {t.nav.logo}
          </Link>
          <div className="hidden items-center gap-8 sm:flex">
            <NavLink href="/start" label={t.nav.start} />
            <NavLink href="/plan" label={t.nav.plan} />
            <NavLink href="/progress" label={t.nav.progress} />
          </div>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <Button href="/start" variant="primary" size="sm">
              {t.nav.startHere}
            </Button>
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 sm:px-6">
        {children}
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
