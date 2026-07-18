"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-6xl font-semibold text-brand-800">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-brand-950">{t.notFound.title}</h1>
      <p className="mt-2 text-ink/60">{t.notFound.body}</p>
      <Link href="/" className="mt-6 rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white">
        {t.notFound.backHome}
      </Link>
    </div>
  );
}
