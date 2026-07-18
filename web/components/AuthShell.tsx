"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Logo from "./Logo";
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
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-brand-900 p-10 text-white lg:flex">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.15]" />
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-500/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative">
          <Logo light />
        </div>
        <div className="relative">
          <Quote className="mb-4 h-8 w-8 text-gold-400" />
          <p className="font-display text-2xl font-medium leading-snug text-white/90">
            &ldquo;{t.auth.quote}&rdquo;
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gold-400 font-display text-sm font-bold text-brand-900">
              MS
            </div>
            <div className="text-sm">
              <p className="font-semibold">{t.auth.quoteAuthor}</p>
              <p className="text-white/60">{t.auth.quoteRole}</p>
            </div>
          </div>
        </div>
        <p className="relative text-xs text-white/40">
          © 2026 Brickfund
        </p>
      </aside>

      {/* Form panel */}
      <section className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link href="/" aria-label="Brickfund home">
              <Logo asLink={false} />
            </Link>
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-brand-900">
            {title}
          </h1>
          <p className="mt-2 text-sm text-ink/60">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-ink/60">{footer}</div>}
        </div>
      </section>
    </div>
  );
}