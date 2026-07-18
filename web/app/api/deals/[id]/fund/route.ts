import { NextRequest, NextResponse } from "next/server";
import { adminPb } from "@/lib/server/pb-admin";
import { getCurrentUser } from "@/lib/server/session";
import { assertState } from "@/lib/server/deals";
import { stripe } from "@/lib/server/stripe";
import { serverEnv } from "@/lib/server/env";
import type { DealRow } from "@/lib/server/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  ctx: RouteContext<"/api/deals/[id]/fund">
): Promise<NextResponse> {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;

  const pb = await adminPb();
  const deal = await pb.collection("deals").getOne<DealRow>(id);
  if (deal.buyer !== user.id) {
    return NextResponse.json({ error: "only the buyer can fund escrow" }, { status: 403 });
  }
  assertState(deal.state, ["apa_signed"]);

  const amount = deal.priceCents + deal.platformFeeCents;
  const intent = await stripe.paymentIntents.create(
    {
      amount,
      currency: deal.currency,
      transfer_group: deal.id,
      metadata: { deal_id: deal.id, type: "escrow_funding" },
      description: `Escrow funding for ${deal.name} (deal ${deal.id})`,
    },
    { idempotencyKey: `pi:fund:${deal.id}` }
  );

  await pb.collection("deals").update<DealRow>(id, { paymentIntentId: intent.id });

  return NextResponse.json({
    clientSecret: intent.client_secret,
    publishableKey: serverEnv.stripe.publishableKey,
    amount,
  });
}
