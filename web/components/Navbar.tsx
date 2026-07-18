"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export default function Navbar() {
  const { user, loading } = useAuth();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  const LINKS = [
    { href: "/businesses", label: t.nav.explore },
    ...(user ? [{ href: "/deals", label: "Deals" }] : []),
    { href: "/#how-it-works", label: t.nav.howItWorks },
    { href: "/#for-investors", label: t.nav.forInvestors },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-cream-200 bg-cream-50/80 backdrop-blur-md dark:border-brand-700/30 dark:bg-brand-900/80">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-cream-100 hover:text-brand-800 dark:text-gray-300 dark:hover:bg-brand-800/50 dark:hover:text-gold-300"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          <ThemeToggle />
          {loading ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-cream-100" />
          ) : user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-cream-100 hover:text-brand-800 dark:text-gray-300 dark:hover:bg-brand-800/50 dark:hover:text-gold-300"
              >
                {t.nav.dashboard}
              </Link>
              <Link
                href="/logout"
                className="rounded-lg border border-cream-200 px-3.5 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-cream-100 dark:border-brand-700/30 dark:text-gray-300 dark:hover:bg-brand-800/50"
              >
                {t.nav.signOut}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-cream-100 dark:text-gray-300 dark:hover:bg-brand-800/50"
              >
                {t.nav.signIn}
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-800 dark:bg-brand-800 dark:hover:bg-brand-700 dark:shadow-soft"
              >
                {t.nav.getStarted}
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <LanguageSwitcher compact />
          <ThemeToggle />
          <button
            className="grid h-10 w-10 place-items-center rounded-lg text-brand-900 dark:text-gold-300"
            onClick={() => setOpen((v) => !v)}
            aria-label={t.nav.toggleMenu}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-cream-200 bg-cream-50 md:hidden dark:border-brand-700/30 dark:bg-brand-900/80">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-cream-100 dark:text-gray-300 dark:hover:bg-brand-800/50"
              >
                {l.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-cream-200 dark:bg-brand-700/30" />
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-cream-100 dark:text-gray-300 dark:hover:bg-brand-800/50"
                >
                  {t.nav.dashboard}
                </Link>
                <Link
                  href="/logout"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-cream-200 px-3 py-2.5 text-center text-sm font-medium text-ink/80 dark:border-brand-700/30 dark:text-gray-300"
                >
                  {t.nav.signOut}
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-cream-100 dark:text-gray-300 dark:hover:bg-brand-800/50"
                >
                  {t.nav.signIn}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-brand-700 px-3 py-2.5 text-center text-sm font-semibold text-white dark:bg-brand-800"
                >
                  {t.nav.getStarted}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
