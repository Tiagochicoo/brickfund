export type DealState =
  | "negotiating"
  | "loi_sent"
  | "loi_signed"
  | "apa_sent"
  | "apa_signed"
  | "funds_held"
  | "handover_confirmed"
  | "completed"
  | "declined"
  | "refunded"
  | "disputed";

export type DealRow = {
  id: string;
  created: string;
  updated: string;
  business: string;
  buyer: string;
  seller: string;
  name: string;
  description: string;
  priceCents: number;
  platformFeeCents: number;
  currency: string;
  state: DealState;
  paymentIntentId: string | null;
  chargeId: string | null;
  transferId: string | null;
  loiDocumentId: number | null;
  apaDocumentId: number | null;
  fundsHeldAt: string | null;
  buyerConfirmedAt: string | null;
  sellerConfirmedAt: string | null;
  expand?: {
    business?: import("@/lib/types").Business;
    buyer?: import("@/lib/types").User;
    seller?: import("@/lib/types").User;
  };
};

export type DealEventRow = {
  id: string;
  created: string;
  deal: string;
  type: string;
  message: string;
  actor: string | null;
  metadata: Record<string, unknown> | null;
  expand?: { actor?: import("@/lib/types").User };
};

export type WebhookEventRow = {
  id: string;
  source: "stripe" | "documenso";
  processed: boolean;
  error: string | null;
  payload: unknown;
  created: string;
};

export type StripeAccountRow = {
  id: string;
  created: string;
  updated: string;
  owner: string;
  stripeAccountId: string;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  expand?: { owner?: import("@/lib/types").User };
};
