import type { DealState } from "@/lib/server/types";

/** Shared labels — safe for client + server (no Stripe/admin imports). */
export const DEAL_STATE_LABELS: Record<DealState, string> = {
  negotiating: "Negotiating",
  loi_sent: "LOI sent",
  loi_signed: "LOI signed",
  apa_sent: "APA sent",
  apa_signed: "APA signed",
  funds_held: "Funds in escrow",
  handover_confirmed: "Handover confirmed",
  completed: "Completed",
  declined: "Declined",
  refunded: "Refunded",
  disputed: "Disputed",
};
