# Dispute resolution guide

## What is a disputed deal?

Either party can open a dispute when the deal state is `funds_held` or `handover_confirmed`. Funds stay on the platform Stripe balance until you resolve the dispute.

## How to resolve a dispute

1. Find the deal
   - Open PocketBase Admin.
   - Go to `deals`.
   - Filter by `state = "disputed"`.
   - Note the `buyer`, `seller`, `priceCents`, `paymentIntentId`, and `chargeId`.

2. Read the timeline
   - Open `deal_events` for that deal.
   - Read the messages and metadata.

3. Contact both parties
   - Send email to both sides.
   - Ask for evidence (photos, signed APA, shipping info, etc.).

4. Decide the outcome

   Choose one of these options:

   - **Refund to buyer**
     - Only possible if no `transferId` exists.
     - Go to Stripe Dashboard.
     - Refund the PaymentIntent.
     - The webhook will update the deal state to `refunded`.

   - **Release to seller**
     - Only after you verify handover.
     - Ensure both parties confirmed (or you have written consent).
     - The system runs the transfer.
     - The transfer uses `source_transaction = chargeId`.

   - **Partial refund**
     - Use Stripe Dashboard manually.
     - Log a note in `deal_events`.

5. Log the decision
   - Create a `deal_events` row.
   - Set type to `admin_resolution`.
   - Write a summary of the decision.
   - Set actor to your user ID if possible.

6. Close the case
   - Confirm the final state is `refunded`, `completed`, or back to `funds_held` with clear notes.

## Current limitations

- There is no full admin UI. Use PocketBase Admin and Stripe Dashboard.
- The app only allows buyer-initiated refunds (for security).
- After `transferId` is set, the app blocks refunds.

## How to prevent disputes

- Require LOI and APA completion before funding.
- Add clear handover checklists in the deal room.
- Keep `DOCUMENSO_WEBHOOK_SECRET` and Stripe webhook secrets secure.