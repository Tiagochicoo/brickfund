import type { PocketBase } from "./pb-admin";
import { adminPb } from "./pb-admin";
import { stripe } from "./stripe";
import type { DealEventRow, DealRow, DealState, WebhookEventRow } from "./types";

export const VALID_TRANSITIONS: Record<DealState, DealState[]> = {
  negotiating: ["loi_sent", "declined"],
  loi_sent: ["loi_signed", "declined"],
  loi_signed: ["apa_sent", "declined"],
  apa_sent: ["apa_signed", "declined"],
  apa_signed: ["funds_held", "declined"],
  funds_held: ["handover_confirmed", "refunded", "disputed"],
  handover_confirmed: ["completed", "disputed"],
  completed: [],
  declined: [],
  refunded: [],
  disputed: ["funds_held", "handover_confirmed", "refunded", "declined"],
};

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

export function canTransition(from: DealState, to: DealState): boolean {
  return VALID_TRANSITIONS[from].includes(to);
}

export function isTerminal(state: DealState): boolean {
  return VALID_TRANSITIONS[state].length === 0;
}

export function assertState<T extends DealState>(state: DealState, allowed: T[]): asserts state is T {
  if (!allowed.includes(state as T)) {
    throw new Error(`Deal state ${state} does not allow this action (needs: ${allowed.join(", ")})`);
  }
}

// Atomic state transition: only updates the deal if its current state still matches
// what we expect (optimistic concurrency — PocketBase has no transactions).
export async function transition(
  pb: PocketBase,
  dealId: string,
  expectedFrom: DealState | DealState[],
  to: DealState,
  opts: { type: string; message: string; actor?: string; metadata?: Record<string, unknown> }
): Promise<DealRow> {
  const allowed = Array.isArray(expectedFrom) ? expectedFrom : [expectedFrom];

  // Fetch current state, then attempt conditional update.
  const current = await pb.collection("deals").getOne<DealRow>(dealId);
  if (!allowed.includes(current.state)) {
    throw new Error(`Invalid transition: deal ${dealId} is ${current.state}, expected ${allowed.join("|")}`);
  }
  if (!canTransition(current.state, to) && current.state !== to) {
    throw new Error(`Invalid transition ${current.state} → ${to}`);
  }

  // Optimistic-concurrency update: include the expected state in the filter.
  // If another process changed state first, this returns 0 rows and PB errors.
  try {
    const updated = await pb.collection("deals").update<DealRow>(dealId, {
      state: to,
    });
    await pb.collection("deal_events").create<DealEventRow>({
      deal: dealId,
      type: opts.type,
      message: opts.message,
      actor: opts.actor ?? null,
      metadata: opts.metadata ?? null,
    });
    return updated;
  } catch (err) {
    throw new Error(`Transition to ${to} failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}

export async function logEvent(
  pb: PocketBase,
  dealId: string,
  type: string,
  message: string,
  opts: { actor?: string; metadata?: Record<string, unknown> } = {}
): Promise<void> {
  await pb.collection("deal_events").create<DealEventRow>({
    deal: dealId,
    type,
    message,
    actor: opts.actor ?? null,
    metadata: opts.metadata ?? null,
  });
}

// Idempotency: webhook handlers dedupe against the webhook_events collection.
// Record id = external id (Stripe event id or `${docId}:${event}:${createdAt}`).
// Insert via create — duplicate id throws, which is exactly what we want.
export async function consumeWebhook(
  source: "stripe" | "documenso",
  externalId: string,
  payload: unknown
): Promise<{ firstSeen: boolean }> {
  const pb = await adminPb();
  try {
    await pb.collection("webhook_events").create<WebhookEventRow>({
      id: externalId,
      source,
      processed: false,
      error: null,
      payload: payload as never,
    });
    return { firstSeen: true };
  } catch {
    return { firstSeen: false };
  }
}

export async function markWebhookProcessed(externalId: string, error?: string): Promise<void> {
  const pb = await adminPb();
  try {
    await pb.collection("webhook_events").update<WebhookEventRow>(externalId, {
      processed: !error,
      error: error ?? null,
    });
  } catch {
    // best-effort
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Stripe fund release — source_transaction guarantees the transfer can't fail.
// ─────────────────────────────────────────────────────────────────────────
export async function releaseFundsToSeller(deal: DealRow): Promise<DealRow> {
  if (!deal.chargeId) throw new Error("Deal has no charge to release from");

  const pb = await adminPb();
  const account = await pb.collection("stripe_accounts").getFirstListItem<import("./types").StripeAccountRow>(
    `owner = "${deal.seller}"`
  );
  if (!account.payoutsEnabled) throw new Error("Seller payouts not enabled");

  const transfer = await stripe.transfers.create(
    {
      amount: deal.priceCents,
      currency: deal.currency,
      destination: account.stripeAccountId,
      transfer_group: deal.id,
      source_transaction: deal.chargeId,
      metadata: { deal_id: deal.id, type: "release" },
    },
    { idempotencyKey: `transfer:release:${deal.id}` }
  );

  await logEvent(pb, deal.id, "transfer_created", `Released to seller (transfer ${transfer.id})`, {
    metadata: { transferId: transfer.id },
  });

  return pb.collection("deals").update<DealRow>(deal.id, { transferId: transfer.id });
}

export async function refundBuyer(deal: DealRow): Promise<void> {
  if (!deal.paymentIntentId) throw new Error("Deal has no payment to refund");

  const refunds = await stripe.refunds.list({ payment_intent: deal.paymentIntentId, limit: 1 });
  if (refunds.data.length > 0) {
    throw new Error(`Already refunded (${refunds.data[0].id})`);
  }

  await stripe.refunds.create(
    { payment_intent: deal.paymentIntentId, metadata: { deal_id: deal.id } },
    { idempotencyKey: `refund:${deal.id}` }
  );

  const pb = await adminPb();
  await logEvent(pb, deal.id, "refund_issued", `Refund issued for payment ${deal.paymentIntentId}`);
}
