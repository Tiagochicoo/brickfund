"use client";

import type { ReactNode } from "react";
import { useI18n } from "@/lib/i18n";

export function LegalShell({ title, children }: { title: string; children: ReactNode }) {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-gold-600">{t.footer.legal}</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-brand-950">{title}</h1>
      <p className="mt-2 text-sm text-ink/50">{t.legal.lastUpdated}</p>
      <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        {t.legal.counselNote}
      </p>
      <div className="prose prose-sm mt-8 max-w-none space-y-4 text-ink/75">{children}</div>
    </div>
  );
}
