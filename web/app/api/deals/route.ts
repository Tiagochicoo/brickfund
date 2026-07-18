import { NextRequest, NextResponse } from "next/server";
import { adminPb } from "@/lib/server/pb-admin";
import { getCurrentUser } from "@/lib/server/session";
import { calculatePlatformFee } from "@/lib/server/stripe";
import type { Business, User } from "@/lib/types";
import type { DealRow } from "@/lib/server/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/deals — list deals for the current user (buyer or seller)
export async function GET(req: NextRequest): Promise<NextResponse> {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const pb = await adminPb();
  const filter = `buyer = "${user.id}" || seller = "${user.id}"`;
  const res = await pb.collection("deals").getList<DealRow>(1, 100, {
    filter,
    sort: "-updated",
    expand: "business,buyer,seller",
  });
  return NextResponse.json({ deals: res.items });
}

// POST /api/deals — create a new deal (investor initiates on a business)
export async function POST(req: NextRequest): Promise<NextResponse> {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json()) as { businessId?: string; amountCents?: number; note?: string };
  if (!body.businessId || typeof body.amountCents !== "number" || body.amountCents < 1000) {
    return NextResponse.json({ error: "businessId and amountCents (>= 1000) required" }, { status: 400 });
  }

  const pb = await adminPb();
  const business = await pb.collection("businesses").getOne<Business>(body.businessId, { expand: "owner" });
  if (!business.published) {
    return NextResponse.json({ error: "business not published" }, { status: 400 });
  }
  const sellerId = String(business.expand?.owner?.id ?? business.owner);
  if (sellerId === user.id) {
    return NextResponse.json({ error: "cannot invest in your own listing" }, { status: 400 });
  }

  const seller = await pb.collection("users").getOne<User>(sellerId);

  const platformFeeCents = calculatePlatformFee(body.amountCents);
  const deal = await pb.collection("deals").create<DealRow>({
    business: business.id,
    buyer: user.id,
    seller: sellerId,
    name: `Investment in ${business.name}`,
    description: body.note?.trim() || `Investment from ${user.name} into ${business.name}.`,
    priceCents: body.amountCents,
    platformFeeCents,
    currency: "usd",
    state: "negotiating",
  });

  await pb.collection("deal_events").create({
    deal: deal.id,
    type: "deal_created",
    message: `${user.name} initiated a ${formatCents(body.amountCents)} investment in ${business.name}`,
    actor: user.id,
    metadata: { amountCents: body.amountCents, platformFeeCents },
  });

  return NextResponse.json({
    deal: {
      ...deal,
      expand: { business, buyer: user, seller },
    },
  });
}

function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}
