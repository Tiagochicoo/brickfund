import { NextRequest, NextResponse } from "next/server";
import { adminPb } from "@/lib/server/pb-admin";
import { getCurrentUser } from "@/lib/server/session";
import { refundBuyer, transition } from "@/lib/server/deals";
import type { DealRow, DealState } from "@/lib/server/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  ctx: RouteContext<"/api/deals/[id]/resolve">
): Promise<NextResponse> {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as { action?: "refund" | "dispute" };

  const pb = await adminPb();
  const deal = await pb.collection("deals").getOne<DealRow>(id);
  const isBuyer = deal.buyer === user.id;
  const isSeller = deal.seller === user.id;
  if (!isBuyer && !isSeller) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  if (body.action === "refund") {
    if (!isBuyer) {
      return NextResponse.json({ error: "only the buyer can request a refund" }, { status: 403 });
    }
    if (!["funds_held", "disputed"].includes(deal.state)) {
      return NextResponse.json({ error: `cannot refund from ${deal.state}` }, { status: 400 });
    }
    await refundBuyer(deal);
    if (deal.state === "disputed") {
      try {
        await transition(pb, id, "disputed" as DealState, "refunded", {
          type: "refunded",
          message: "Escrow refunded to buyer",
          actor: user.id,
        });
      } catch {
        // refund already issued; state may have moved concurrently
      }
    }
    return NextResponse.json({ ok: true });
  }

  if (body.action === "dispute") {
    if (!["funds_held", "handover_confirmed"].includes(deal.state)) {
      return NextResponse.json({ error: `cannot dispute from ${deal.state}` }, { status: 400 });
    }
    await transition(pb, id, deal.state as DealState, "disputed", {
      type: "disputed",
      message: "Dispute opened — funds frozen pending review",
      actor: user.id,
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
