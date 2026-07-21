import { NextRequest, NextResponse } from "next/server";
import { adminPb } from "@/lib/server/pb-admin";
import { getCurrentUser } from "@/lib/server/session";
import { logEvent, releaseFundsToSeller, transition } from "@/lib/server/deals";
import type { DealRow, DealState } from "@/lib/server/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  ctx: RouteContext<"/api/deals/[id]/confirm-handover">
): Promise<NextResponse> {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;

  await req.json().catch(() => ({}));

  const pb = await adminPb();
  const deal = await pb.collection("deals").getOne<DealRow>(id);

  const isBuyer = deal.buyer === user.id;
  const isSeller = deal.seller === user.id;
  if (!isBuyer && !isSeller) {
    return NextResponse.json({ error: "not a party to this deal" }, { status: 403 });
  }
  if (!["funds_held", "handover_confirmed"].includes(deal.state)) {
    return NextResponse.json({ error: `cannot confirm handover from ${deal.state}` }, { status: 400 });
  }

  const role = isBuyer ? "buyer" : "seller";
  const now = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");

  const updated = await pb.collection("deals").update<DealRow>(id, {
    buyerConfirmedAt: role === "buyer" ? now : deal.buyerConfirmedAt,
    sellerConfirmedAt: role === "seller" ? now : deal.sellerConfirmedAt,
  });

  await logEvent(pb, id, "handover_confirmed", `${role} confirmed handover`, {
    actor: user.id,
    metadata: { role },
  });

  if (updated.buyerConfirmedAt && updated.sellerConfirmedAt) {
    await transition(pb, id, ["funds_held", "handover_confirmed"] as DealState[], "handover_confirmed", {
      type: "handover_confirmed_both",
      message: "Both parties confirmed handover — releasing funds to seller",
    });
    const fresh = await pb.collection("deals").getOne<DealRow>(id);
    await releaseFundsToSeller(fresh);
    return NextResponse.json({ ok: true, released: true });
  }

  return NextResponse.json({
    ok: true,
    released: false,
    waiting: role === "buyer" ? "seller" : "buyer",
  });
}
