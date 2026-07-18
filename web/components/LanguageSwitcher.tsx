"use client";

import { useState, useRef, useEffect } from "react";
import { Check, Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LOCALES } from "@/lib/i18n/locales";

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative z-50" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-cream-100 hover:text-brand-800"
        aria-label="Change language"
        aria-expanded={open}
      >
        <Globe className="h-4 w-4" />
        {!compact && <span>{current.native}</span>}
        {!compact && <span className="text-base leading-none">{current.flag}</span>}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 max-h-80 w-48 overflow-auto rounded-xl border border-cream-200 bg-white py-1 shadow-card">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                setLocale(l.code);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-brand-50 ${
                l.code === locale ? "text-brand-800" : "text-ink/70"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-base">{l.flag}</span>
                {l.native}
              </span>
              {l.code === locale && <Check className="h-4 w-4 text-brand-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}