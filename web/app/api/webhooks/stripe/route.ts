import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/server/stripe";
import { adminPb } from "@/lib/server/pb-admin";
import { consumeWebhook, logEvent, markWebhookProcessed, refundBuyer, releaseFundsToSeller, transition } from "@/lib/server/deals";
import { serverEnv } from "@/lib/server/env";
import type { DealRow, StripeAccountRow } from "@/lib/server/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "missing signature" }, { status: 400 });

  const rawBody = Buffer.from(await req.arrayBuffer());

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, serverEnv.stripe.webhookSecret);
  } catch (err) {
    console.error("[stripe webhook] signature verification failed", err);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  const { shouldProcess } = await consumeWebhook("stripe", event.id, event);
  if (!shouldProcess) return NextResponse.json({ received: true, duplicate: true });

  const pb = await adminPb();
  try {
    await handleEvent(pb, event);
    await markWebhookProcessed(event.id);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[stripe webhook] handler failed", message);
    await markWebhookProcessed(event.id, message);
    return NextResponse.json({ error: "handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleEvent(pb: Awaited<ReturnType<typeof adminPb>>, event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case "account.updated": {
      const acct = event.data.object as Stripe.Account;
      try {
        const sa = await pb.collection("stripe_accounts").getFirstListItem<StripeAccountRow>(
          `stripeAccountId = "${acct.id}"`
        );
        const ready =
          !!acct.details_submitted &&
          (acct.requirements?.currently_due ?? []).length === 0 &&
          (acct.requirements?.eventually_due ?? []).length === 0;
        await pb.collection("stripe_accounts").update(sa.id, {
          detailsSubmitted: !!acct.details_submitted,
          payoutsEnabled: ready && acct.payouts_enabled === true,
        });
      } catch {
        // unknown account, ignore
      }
      break;
    }

    case "payment_intent.succeeded": {
      const pi = event.data.object as Stripe.PaymentIntent;
      const dealId = pi.metadata?.deal_id;
      if (!dealId) return;

      const chargeId = typeof pi.latest_charge === "string" ? pi.latest_charge : pi.latest_charge?.id ?? null;
      await pb.collection("deals").update<DealRow>(dealId, {
        paymentIntentId: pi.id,
        chargeId,
        fundsHeldAt: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
      });
      await transition(pb, dealId, "apa_signed", "funds_held", {
        type: "funds_held",
        message: `Escrow funded (${pi.amount / 100} ${pi.currency.toUpperCase()}) — funds held on platform balance`,
        metadata: { paymentIntentId: pi.id },
      });
      // Idempotent fundingRaised bump (once per deal)
      try {
        const deal = await pb.collection("deals").getOne<DealRow>(dealId);
        const already = await pb.collection("deal_events").getList(1, 1, {
          filter: `deal = "${dealId}" && type = "funding_counted"`,
        });
        if (already.totalItems === 0) {
          const biz = await pb.collection("businesses").getOne<{ id: string; fundingRaised: number; fundingGoal: number }>(deal.business);
          const add = deal.priceCents / 100;
          const next = Math.min((biz.fundingRaised || 0) + add, biz.fundingGoal || Number.MAX_SAFE_INTEGER);
          await pb.collection("businesses").update(biz.id, { fundingRaised: next });
          await logEvent(pb, dealId, "funding_counted", `Counted €${add} toward listing progress`, {
            metadata: { amountMajor: add, paymentIntentId: pi.id },
          });
        }
      } catch (e) {
        console.error("[stripe webhook] fundingRaised update failed", e);
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const pi = event.data.object as Stripe.PaymentIntent;
      const dealId = pi.metadata?.deal_id;
      if (!dealId) return;
      await logEvent(pb, dealId, "payment_failed", `Payment failed: ${pi.last_payment_error?.message ?? "unknown"}`);
      break;
    }

    case "charge.refunded": {
      const ch = event.data.object as Stripe.Charge;
      const dealId = ch.metadata?.deal_id;
      if (!dealId) return;
      const deal = await pb.collection("deals").getOne<DealRow>(dealId);
      if (deal.state !== "refunded") {
        await transition(pb, dealId, ["funds_held", "disputed"], "refunded", {
          type: "refunded",
          message: `Refunded ${(ch.amount_refunded / 100).toFixed(2)} ${ch.currency.toUpperCase()} to buyer`,
        });
      }
      break;
    }

    case "transfer.created": {
      const tr = event.data.object as Stripe.Transfer;
      const dealId = tr.metadata?.deal_id;
      if (!dealId) return;
      const deal = await pb.collection("deals").getOne<DealRow>(dealId);
      if (deal.state !== "completed") {
        await pb.collection("deals").update<DealRow>(deal.id, { transferId: tr.id });
        await transition(pb, deal.id, ["handover_confirmed", "disputed"], "completed", {
          type: "completed",
          message: `Funds released to seller (transfer ${tr.id}). Deal complete.`,
        });
      }
      break;
    }

    case "transfer.reversed": {
      const tr = event.data.object as Stripe.Transfer;
      const dealId = tr.metadata?.deal_id;
      if (dealId) await logEvent(pb, dealId, "transfer_reversed", `Transfer ${tr.id} reversed`);
      break;
    }

    default:
      break;
  }
}

// Import-paid escrow path: when both parties confirm handover, call this.
void releaseFundsToSeller;
void refundBuyer;
