# Dispute resolution runbook

## When a deal is `disputed`

Either party can open a dispute from `funds_held` (or from `handover_confirmed` via API). Funds remain on the platform Stripe balance until resolved.

## Operator steps

1. **Identify deal** — PocketBase Admin → `deals` → filter `state = "disputed"`. Note `buyer`, `seller`, `priceCents`, `paymentIntentId`, `chargeId`.
2. **Read timeline** — `deal_events` for that deal id (messages + metadata).
3. **Contact parties** — email both sides; request evidence (handover photos, signed APA, shipping, etc.).
4. **Decide outcome**
   - **Refund buyer** — only if no `transferId` yet. Use Stripe Dashboard refund on the PaymentIntent **or** call resolve API as buyer (buyer-only policy in app). Prefer Dashboard for operator control; then ensure webhook marks `refunded`.
   - **Release to seller** — if handover is verified: ensure both confirmations (or set intentionally after written consent), then run release path / complete transfer with `source_transaction = chargeId`.
   - **Partial** — handle manually in Stripe; log `deal_events` note via Admin.
5. **Log** — create a `deal_events` row: type `admin_resolution`, message summarizing decision, actor = operator user id if available.
6. **Close** — confirm final `state` is `refunded`, `completed`, or returned to `funds_held` with clear notes.

## App limitations (current)

- No full admin UI yet — use PocketBase Admin + Stripe Dashboard.
- Refund API is **buyer-initiated** only (security). Operator refunds via Stripe Dashboard.
- After `transferId` is set, in-app refund is blocked.

## Prevention

- Require LOI+APA completion before fund.
- Prefer clear handover checklists in deal room copy.
- Keep `DOCUMENSO_WEBHOOK_SECRET` and Stripe webhook secrets set in production.
