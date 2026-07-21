/**
 * Smoke tests for deal state machine rules (pure, no Stripe/env).
 * Run: npx tsx scripts/smoke-deal-transitions.ts
 */
import assert from "node:assert/strict";
import type { DealState } from "../web/lib/server/types";
import { DEAL_STATE_LABELS } from "../web/lib/deal-labels";

const VALID_TRANSITIONS: Record<DealState, DealState[]> = {
  negotiating: ["loi_sent", "declined"],
  loi_sent: ["loi_signed", "declined"],
  loi_signed: ["apa_sent", "declined"],
  apa_sent: ["apa_signed", "declined"],
  apa_signed: ["funds_held", "declined"],
  funds_held: ["handover_confirmed", "refunded", "disputed"],
  handover_confirmed: ["completed", "disputed"],
  completed: [],
  declined: [],
  refunded: [],
  disputed: ["funds_held", "handover_confirmed", "refunded", "declined"],
};

function canTransition(from: DealState, to: DealState) {
  return VALID_TRANSITIONS[from].includes(to);
}

assert.equal(canTransition("negotiating", "loi_sent"), true);
assert.equal(canTransition("apa_signed", "funds_held"), true);
assert.equal(canTransition("negotiating", "completed"), false);
assert.equal(VALID_TRANSITIONS.completed.length, 0);
assert.equal(DEAL_STATE_LABELS.funds_held.length > 0, true);
// Labels cover every state
for (const s of Object.keys(VALID_TRANSITIONS) as DealState[]) {
  assert.ok(DEAL_STATE_LABELS[s], `missing label for ${s}`);
}

console.log("smoke-deal-transitions: OK");
