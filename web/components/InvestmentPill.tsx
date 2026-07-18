"use client";

import type { InvestmentType } from "@/lib/types";
import { getInvestmentTypeMeta } from "@/lib/constants";
import { useI18n } from "@/lib/i18n";

export default function InvestmentPill({
  type,
  size = "md",
}: {
  type: InvestmentType;
  size?: "sm" | "md";
}) {
  const { t } = useI18n();
  const meta = getInvestmentTypeMeta(type, t);
  const pad = size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ring-inset ${meta.pill} ${pad}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}
