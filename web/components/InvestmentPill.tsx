import type { InvestmentType } from "@/lib/types";
import { INVESTMENT_TYPES } from "@/lib/constants";

export default function InvestmentPill({
  type,
  size = "md",
}: {
  type: InvestmentType;
  size?: "sm" | "md";
}) {
  const meta = INVESTMENT_TYPES[type];
  if (!meta) return null;
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
