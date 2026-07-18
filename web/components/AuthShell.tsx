"use client";

import type { ReactNode } from "react";
import { Quote } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const { t } = useI18n();
  return (
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-0 px-0 lg:grid-cols-2 lg:gap-0">
      {/* Brand panel */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-brand-900 p-10 text-white lg:flex dark:bg-brand-950 dark:text-gold-50">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.15] dark:opacity-[0.08]" />
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-500/20 blur-3xl dark:bg-gold-500/10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl dark:bg-brand-700/20"
          aria-hidden="true"
        />
        <div className="relative">
          <Quote className="mb-4 h-8 w-8 text-gold-400 dark:text-gold-300" />
          <p className="font-display text-2xl font-medium leading-snug text-white/90 dark:text-gold-50/90">
            &ldquo;{t.auth.quote}&rdquo;
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gold-400 font-display text-sm font-bold text-brand-900 dark:bg-gold-500 dark:text-brand-950">
              MS
            </div>
            <div className="text-sm">
              <p className="font-semibold dark:text-gold-100">{t.auth.quoteAuthor}</p>
              <p className="text-white/60 dark:text-gold-200/60">{t.auth.quoteRole}</p>
            </div>
          </div>
        </div>
        <p className="relative text-xs text-white/40 dark:text-gold-200/40">
          © 2026 Brickfund
        </p>
      </aside>

      {/* Form panel */}
      <section className="flex items-center justify-center px-4 py-12 sm:px-8 dark:bg-brand-900/30">
        <div className="w-full max-w-md">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-brand-900 dark:text-gold-100">
            {title}
          </h1>
          <p className="mt-2 text-sm text-ink/60 dark:text-gray-400">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-ink/60 dark:text-gray-400">{footer}</div>}
        </div>
      </section>
    </div>
  );
}