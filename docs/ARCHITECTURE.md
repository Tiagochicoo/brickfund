# Architecture

## System components

```
Browser
  │
  ├─ Next.js UI (brick-fund.com :3001)
  │
  └─ PocketBase SDK (reads data + user login)
       │
       ▼
Next.js API routes (/api/deals, /api/webhooks, /api/sellers)
  │
  ├─ PocketBase admin client (superuser access)
  │
  ├─ Stripe SDK (payments)
  │
  └─ Documenso HTTP (e-signatures)
       │
       ▼
PocketBase (:8093) ── SQLite database
Stripe ── webhooks ──► /api/webhooks/stripe
Documenso ── webhooks ──► /api/webhooks/documenso
```

## Authentication

| Connection | Method |
|------------|--------|
| Browser to PocketBase | Email and password. Token stored in cookie and in memory. |
| Browser to Next.js API | Token sent in `Authorization` header. |
| Next.js to PocketBase admin | Admin email and password. Do not use user tokens here. |
| Server pages | Use admin client and check request headers. |

## Deal states

A deal moves through these states:

```
negotiating → loi_sent → loi_signed → apa_sent → apa_signed → funds_held → handover_confirmed → completed
```

A deal can also go to these states:
- `disputed` (someone raises an issue)
- `refunded` (investor gets money back)
- `declined` (deal cancelled)

The state machine is in `web/lib/server/deals.ts`.

## PocketBase collections

| Collection | Purpose | Access rules |
|------------|---------|--------------|
| users | User accounts and profiles | Authenticated users can view. Anyone can register. Users update their own data. |
| businesses | Business listings | Public users view published listings. Business users create listings. Owners update their listings. |
| deals | Escrow deals | Deal parties can view. Only the server can modify. |
| deal_events | Deal timeline | Deal parties can view. Only the server creates events. |
| webhook_events | Webhook tracking | Only the server reads and writes. |
| stripe_accounts | Stripe Connect accounts | Owners can view. Only the server creates. |

## How payments work

1. Buyer creates a Stripe PaymentIntent. The amount is `priceCents + platformFeeCents`.
2. Stripe sends a `payment_intent.succeeded` webhook.
3. The system saves the `chargeId` and changes the deal state to `funds_held`.
4. The system increases the `fundingRaised` total for the business.
5. Both parties confirm handover.
6. The system sends a Stripe Transfer to the seller. This uses the `chargeId`.

Refunds are possible before the transfer. See [docs/DISPUTE_RUNBOOK.md](docs/DISPUTE_RUNBOOK.md).

## Translations

Translation files are in `web/lib/i18n/`. The base file is `en.ts`. All other locales use this structure.