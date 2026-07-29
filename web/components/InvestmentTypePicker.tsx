"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { INVESTMENT_TYPE_STYLES, getInvestmentTypeMeta } from "@/lib/constants";
import type { InvestmentType } from "@/lib/types";

const TYPES: InvestmentType[] = [
  "seed",
  "growth",
  "loan",
  "equity",
  "revenue_share",
  "convertible_note",
  "trespasse",
];

export default function InvestmentTypePicker({
  value,
  onChange,
}: {
  value: InvestmentType;
  onChange: (v: InvestmentType) => void;
}) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState<InvestmentType | null>(value);

  return (
    <div>
      <p className="text-sm font-medium text-ink">{t.listing.investmentType}</p>
      <p className="mt-0.5 text-xs text-ink/50">{t.listing.investmentTypeHint}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {TYPES.map((type) => {
          const meta = getInvestmentTypeMeta(type, t);
          const selected = value === type;
          const open = expanded === type || selected;
          const style = INVESTMENT_TYPE_STYLES[type];

          return (
            <button
              key={type}
              type="button"
              onClick={() => {
                onChange(type);
                setExpanded(type);
              }}
              className={`rounded-2xl border p-3.5 text-left transition-all ${
                selected
                  ? "border-brand-400 bg-brand-50/80 shadow-soft ring-2 ring-brand-500/20"
                  : "border-cream-200 bg-white hover:border-brand-200 hover:bg-cream-50"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`} />
                  <span className="text-sm font-semibold text-brand-950">{meta.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  {selected && (
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-600 text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                  <ChevronDown
                    className={`h-4 w-4 text-ink/35 transition-transform ${open ? "rotate-180" : ""}`}
                  />
                </div>
              </div>
              {open && (
                <p className="mt-2 text-xs leading-relaxed text-ink/65">{meta.blurb}</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
