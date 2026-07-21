import { NextRequest, NextResponse } from "next/server";
import { adminPb } from "@/lib/server/pb-admin";
import { consumeWebhook, logEvent, markWebhookProcessed, transition } from "@/lib/server/deals";
import { recipientsOf, type DocumensoWebhookPayload } from "@/lib/server/documenso";
import { serverEnv } from "@/lib/server/env";
import type { DealRow } from "@/lib/server/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const configured = serverEnv.documenso.webhookSecret;
  const isProd = process.env.NODE_ENV === "production";
  if (isProd && !configured) {
    console.error("[documenso webhook] DOCUMENSO_WEBHOOK_SECRET missing in production");
    return NextResponse.json({ error: "webhook not configured" }, { status: 503 });
  }
  if (configured) {
    const secret = req.headers.get("x-documenso-secret");
    if (secret !== configured) {
      return NextResponse.json({ error: "invalid secret" }, { status: 401 });
    }
  }

  let payload: DocumensoWebhookPayload;
  try {
    payload = (await req.json()) as DocumensoWebhookPayload;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const documentId = payload.payload?.id;
  const eventType = payload.event;
  if (!documentId || !eventType) {
    return NextResponse.json({ error: "missing id or event" }, { status: 400 });
  }

  const externalId = `${documentId}:${eventType}:${payload.createdAt}`;
  const { firstSeen } = await consumeWebhook("documenso", externalId, payload);
  if (!firstSeen) return NextResponse.json({ received: true, duplicate: true });

  const pb = await adminPb();
  try {
    await handleEvent(pb, payload, documentId, eventType);
    await markWebhookProcessed(externalId);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[documenso webhook] handler failed", message);
    await markWebhookProcessed(externalId, message);
    return NextResponse.json({ error: "handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleEvent(
  pb: Awaited<ReturnType<typeof adminPb>>,
  payload: DocumensoWebhookPayload,
  documentId: number,
  eventType: string
): Promise<void> {
  // Find the deal referencing this document. PocketBase filter on a number field.
  let deal: DealRow | null = null;
  try {
    deal = await pb.collection("deals").getFirstListItem<DealRow>(`loiDocumentId = ${documentId}`);
  } catch {
    try {
      deal = await pb.collection("deals").getFirstListItem<DealRow>(`apaDocumentId = ${documentId}`);
    } catch {
      console.warn(`[documenso webhook] no deal for document ${documentId}`);
      return;
    }
  }

  const isLoi = deal.loiDocumentId === documentId;
  const docLabel = isLoi ? "LOI" : "APA";
  const recipients = recipientsOf(payload.payload);
  const actorEmail = recipients.find((r) => r.signingStatus === "SIGNED")?.email;

  switch (eventType) {
    case "DOCUMENT_OPENED":
      await logEvent(pb, deal.id, "doc_viewed", `${docLabel} opened`, { metadata: { documentId } });
      break;

    case "DOCUMENT_SIGNED":
    case "DOCUMENT_RECIPIENT_COMPLETED":
      await logEvent(
        pb,
        deal.id,
        "doc_signed",
        `${actorEmail ?? "Recipient"} signed the ${docLabel}`,
        { metadata: { documentId, email: actorEmail } }
      );
      break;

    case "DOCUMENT_COMPLETED":
      if (isLoi) {
        await transition(pb, deal.id, "loi_sent", "loi_signed", {
          type: "loi_signed",
          message: "Both parties signed the Letter of Intent",
        });
      } else {
        await transition(pb, deal.id, "apa_sent", "apa_signed", {
          type: "apa_signed",
          message: "Both parties signed the Asset Purchase Agreement — deal is now binding",
        });
      }
      break;

    case "DOCUMENT_REJECTED": {
      const rejecter = recipients.find((r) => r.signingStatus === "REJECTED");
      await transition(pb, deal.id, [
        "negotiating", "loi_sent", "loi_signed", "apa_sent", "apa_signed",
      ], "declined", {
        type: "declined",
        message: `${rejecter?.email ?? "Recipient"} rejected the ${docLabel}${rejecter?.rejectionReason ? `: ${rejecter.rejectionReason}` : ""}`,
        metadata: { documentId, email: rejecter?.email },
      });
      break;
    }

    default:
      break;
  }
}
