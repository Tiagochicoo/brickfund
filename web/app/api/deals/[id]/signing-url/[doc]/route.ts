import { NextRequest, NextResponse } from "next/server";
import { adminPb } from "@/lib/server/pb-admin";
import { getCurrentUser } from "@/lib/server/session";
import { getSigningUrlFor } from "@/lib/server/documenso";
import type { DealRow } from "@/lib/server/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  ctx: RouteContext<"/api/deals/[id]/signing-url/[doc]">
): Promise<NextResponse> {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id, doc } = await ctx.params;

  if (doc !== "loi" && doc !== "apa") {
    return NextResponse.json({ error: "doc must be 'loi' or 'apa'" }, { status: 400 });
  }

  const pb = await adminPb();
  const deal = await pb.collection("deals").getOne<DealRow>(id);
  if (deal.buyer !== user.id && deal.seller !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const documentId = doc === "loi" ? deal.loiDocumentId : deal.apaDocumentId;
  if (!documentId) return NextResponse.json({ error: "no document yet" }, { status: 404 });

  const url = await getSigningUrlFor(documentId, user.email);
  if (!url) return NextResponse.json({ error: "signing url not available" }, { status: 404 });

  return NextResponse.json({ url });
}
