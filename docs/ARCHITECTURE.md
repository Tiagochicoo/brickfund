# Architecture

## Components

```
Browser
  │  Next.js UI (brick-fund.com → :3001)
  │  PocketBase JS SDK (public reads + user auth)
  ▼
Next.js API routes (/api/deals/*, /api/webhooks/*, /api/sellers/*)
  │  admin PocketBase client (superuser)
  │  Stripe SDK · Documenso HTTP
  ▼
PocketBase (:8093) ── SQLite (pb_data)
Stripe ── webhooks ──► /api/webhooks/stripe
Documenso ── webhooks ──► /api/webhooks/documenso
```

## Auth

| Path | Mechanism |
|------|-----------|
| Browser → PB | `authWithPassword`; token in `authStore` + `pb_auth` cookie (JSON `{token,model}`) |
| Browser → Next `/api/*` | `Authorization: <token>` via `apiFetch` + cookie |
| Next → PB admin | `_superusers` auth; **never** load user cookies onto this singleton |
| Server pages | Prefer admin + `getCurrentUser(req)`; do not rely on SDK `loadFromCookie` alone |

## Deal state machine

```
negotiating → loi_sent → loi_signed → apa_sent → apa_signed
    → funds_held → handover_confirmed → completed
         ↘ disputed / refunded / declined (terminal or recoverable per VALID_TRANSITIONS)
```

Transitions: `web/lib/server/deals.ts` (`canTransition`, `transition`).  
Side effects: Stripe PaymentIntent / Transfer; Documenso documents; `deal_events` audit log.

## Collections (PocketBase)

| Collection | Purpose | Client rules (summary) |
|------------|---------|------------------------|
| users | Auth + profiles | list auth; create open; update own |
| businesses | Listings | public published; create business+owner; update owner |
| deals | Escrow deals | party list/view; mutations via admin API |
| deal_events | Timeline | party read; write admin |
| webhook_events | Idempotency | admin only |
| stripe_accounts | Connect accounts | owner read; write admin |

## Money path

1. Buyer creates PaymentIntent for `priceCents + platformFeeCents` (`transfer_group = dealId`).
2. On `payment_intent.succeeded`: store `chargeId`, state → `funds_held`, bump `fundingRaised`.
3. Both parties confirm handover → Transfer to Connect account with `source_transaction = chargeId`.
4. Refunds: buyer-initiated while no `transferId`; operator may use Stripe Dashboard (see dispute runbook).

## i18n

`web/lib/i18n/*` — `TranslationDict` defined in `en.ts`; other locales import the type.
