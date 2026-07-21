import type { PocketBase } from "./pb-admin";
import { adminPb } from "./pb-admin";
import type { WebhookEventRow } from "./types";

/**
 * Idempotency for webhooks.
 * - First time: create row, firstSeen=true, shouldProcess=true
 * - Already processed successfully: firstSeen=false, shouldProcess=false
 * - Exists but failed / not processed: firstSeen=false, shouldProcess=true (retry)
 */
export async function consumeWebhook(
  source: "stripe" | "documenso",
  externalId: string,
  payload: unknown
): Promise<{ firstSeen: boolean; shouldProcess: boolean }> {
  const pb = await adminPb();
  try {
    await pb.collection("webhook_events").create<WebhookEventRow>({
      id: externalId,
      source,
      processed: false,
      error: null,
      payload: payload as never,
    });
    return { firstSeen: true, shouldProcess: true };
  } catch {
    try {
      const existing = await pb.collection("webhook_events").getOne<WebhookEventRow>(externalId);
      if (existing.processed) {
        return { firstSeen: false, shouldProcess: false };
      }
      // Clear previous error for retry attempt
      try {
        await pb.collection("webhook_events").update(externalId, { error: null });
      } catch {
        /* ignore */
      }
      return { firstSeen: false, shouldProcess: true };
    } catch {
      // Could not read existing — do not process blindly
      return { firstSeen: false, shouldProcess: false };
    }
  }
}

export async function markWebhookProcessed(externalId: string, error?: string): Promise<void> {
  const pb = await adminPb();
  try {
    await pb.collection("webhook_events").update<WebhookEventRow>(externalId, {
      processed: !error,
      error: error ?? null,
    });
  } catch {
    // best-effort
  }
}
