import type { DealState } from "@/lib/server/types";
import { DEAL_STATE_LABELS } from "@/lib/deal-labels";

const COLORS: Record<DealState, string> = {
  negotiating: "bg-slate-100 text-slate-700 ring-slate-200",
  loi_sent: "bg-sky-50 text-sky-700 ring-sky-200",
  loi_signed: "bg-sky-50 text-sky-700 ring-sky-200",
  apa_sent: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  apa_signed: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  funds_held: "bg-gold-100 text-gold-800 ring-gold-200",
  handover_confirmed: "bg-gold-100 text-gold-800 ring-gold-200",
  completed: "bg-brand-50 text-brand-700 ring-brand-200",
  declined: "bg-rose-50 text-rose-700 ring-rose-200",
  refunded: "bg-rose-50 text-rose-700 ring-rose-200",
  disputed: "bg-rose-50 text-rose-700 ring-rose-200",
};

export function StateBadge({ state }: { state: DealState }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${COLORS[state]}`}>
      {DEAL_STATE_LABELS[state]}
    </span>
  );
}
