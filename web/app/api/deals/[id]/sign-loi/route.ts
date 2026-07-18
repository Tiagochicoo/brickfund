import { NextRequest, NextResponse } from "next/server";
import { adminPb } from "@/lib/server/pb-admin";
import { getCurrentUser } from "@/lib/server/session";
import { assertState, transition } from "@/lib/server/deals";
import { createDocumentFromTemplate } from "@/lib/server/documenso";
import { serverEnv } from "@/lib/server/env";
import type { DealRow } from "@/lib/server/types";
import type { User } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  ctx: RouteContext<"/api/deals/[id]/sign-loi">
): Promise<NextResponse> {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;

  if (!serverEnv.documenso.loiTemplateId) {
    return NextResponse.json({ error: "DOCUMENSO_LOI_TEMPLATE_ID not set" }, { status: 500 });
  }

  const pb = await adminPb();
  const deal = await pb.collection("deals").getOne<DealRow>(id, { expand: "buyer,seller" });
  if (deal.buyer !== user.id && deal.seller !== user.id) {
    return NextResponse.json({ error: "not a party to this deal" }, { status: 403 });
  }
  assertState(deal.state, ["negotiating"]);

  const buyer = (deal.expand?.buyer ?? (await pb.collection("users").getOne<User>(deal.buyer))) as User;
  const seller = (deal.expand?.seller ?? (await pb.collection("users").getOne<User>(deal.seller))) as User;

  const { documentId } = await createDocumentFromTemplate({
    templateId: serverEnv.documenso.loiTemplateId,
    title: `LOI — ${deal.name} — ${deal.id}`,
    recipients: [
      { name: buyer.name, email: buyer.email, role: "SIGNER", signingOrder: 1 },
      { name: seller.name, email: seller.email, role: "SIGNER", signingOrder: 2 },
    ],
    meta: {
      subject: `Letter of Intent — ${deal.name}`,
      message: `Please review and sign the Letter of Intent for ${deal.name}.`,
      redirectUrl: `${serverEnv.appUrl}/deals/${deal.id}?signed=loi`,
      signingOrder: "PARALLEL",
    },
    distributeDocument: true,
    externalId: `loi:${deal.id}`,
  });

  await pb.collection("deals").update<DealRow>(deal.id, { loiDocumentId: documentId });
  await transition(pb, deal.id, "negotiating", "loi_sent", {
    type: "loi_sent",
    message: "Letter of Intent sent to both parties for signature",
    actor: user.id,
    metadata: { documentId },
  });

  return NextResponse.json({ documentId });
}
