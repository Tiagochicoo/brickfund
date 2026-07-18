import { NextRequest, NextResponse } from "next/server";
import { adminPb } from "@/lib/server/pb-admin";
import { getCurrentUser } from "@/lib/server/session";
import { stripe } from "@/lib/server/stripe";
import { serverEnv } from "@/lib/server/env";
import type { StripeAccountRow } from "@/lib/server/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (user.role !== "business") {
    return NextResponse.json({ error: "only business accounts can onboard as sellers" }, { status: 403 });
  }

  const pb = await adminPb();

  let account: StripeAccountRow | null = null;
  try {
    account = await pb.collection("stripe_accounts").getFirstListItem<StripeAccountRow>(`owner = "${user.id}"`);
  } catch {
    // none yet
  }

  let stripeAccountId = account?.stripeAccountId;
  if (!stripeAccountId) {
    const created = await stripe.accounts.create({
      type: "express",
      country: "US",
      email: user.email,
      capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
      metadata: { user_id: user.id, name: user.name },
    });
    stripeAccountId = created.id;
    account = await pb.collection("stripe_accounts").create<StripeAccountRow>({
      owner: user.id,
      stripeAccountId,
      payoutsEnabled: false,
      detailsSubmitted: false,
    });
  } else if (!account?.payoutsEnabled) {
    await stripe.accounts.update(stripeAccountId, {
      capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
    });
  }

  const link = await stripe.accountLinks.create({
    account: stripeAccountId,
    type: "account_onboarding",
    return_url: `${serverEnv.appUrl}/sellers/onboarding/return?account=${stripeAccountId}`,
    refresh_url: `${serverEnv.appUrl}/sellers/onboarding?refresh=1`,
  });

  return NextResponse.json({ url: link.url });
}
