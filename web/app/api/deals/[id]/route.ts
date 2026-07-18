import { NextRequest, NextResponse } from "next/server";
import { adminPb } from "@/lib/server/pb-admin";
import { getCurrentUser } from "@/lib/server/session";
import type { DealEventRow, DealRow } from "@/lib/server/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  ctx: RouteContext<"/api/deals/[id]">
): Promise<NextResponse> {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;

  const pb = await adminPb();
  const deal = await pb.collection("deals").getOne<DealRow>(id, {
    expand: "business,buyer,seller",
  });
  if (deal.buyer !== user.id && deal.seller !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const events = await pb.collection("deal_events").getFullList<DealEventRow>({
    filter: `deal = "${id}"`,
    sort: "created",
    expand: "actor",
  });

  return NextResponse.json({ deal, events, currentUserId: user.id });
}
