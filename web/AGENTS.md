<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project: brickfund

Premium SaaS marketplace connecting brick-and-mortar businesses with investors, with Stripe Connect escrow + Documenso CE e-signatures built-in.

## Top-level layout

```
brickfund/
├── backend/                PocketBase binary + migrations (users, businesses, deals, deal_events, webhook_events, stripe_accounts)
├── web/                    Next.js 16 (App Router, Turbopack) + React 19 + Tailwind v4
├── docs/DEPLOY-FREE.md     $0/month production deployment guide
└── docker-compose.yml      Documenso CE + Postgres (PocketBase runs as binary)
```

## Commands (run inside `web/`)

- `npm run dev` — Next.js 16 dev server (Turbopack)
- `npm run build` — production build (Turbopack)
- `npm run start` — serve the production build
- `npm run lint` — eslint (flat config)

PocketBase: `cd ../backend && ./setup.sh` then `./start.sh`.

## Next.js 16 notes

This is **Next.js 16.2.10**, not 15. Read `node_modules/next/dist/docs/` before touching routing/auth/route handlers. Key differences from 15:
- Turbopack is the default dev + build (no flag).
- `params` / `searchParams` / `cookies()` / `headers()` are async (Promise-returning).
- Route handlers use the global `RouteContext<'/api/deals/[id]'>` helper for typed params.
- `next lint` removed — use eslint directly.
- `middleware` renamed to `proxy`.

## Conventions

- **No comments** unless asked.
- Every money-mutating Stripe call passes a **content-addressed idempotency key** (`transfer:release:${deal.id}`). Never random UUIDs.
- Webhook handlers **verify signature**, **dedupe via `webhook_events` collection (id = external id)**, **ack 2xx immediately**, then process.
- Deal state transitions go through `transition()` in `web/lib/server/deals.ts` — never mutate `Deal.state` directly. The helper does optimistic-concurrency updates against PocketBase.
- AGPL boundary: Documenso is reached **only** over HTTP via `web/lib/server/documenso.ts`. Never import Documenso code or share its DB.
- Server-side code lives under `web/lib/server/`. Never import these from client components.

## Authentication

- Client: PocketBase authStore (cookie-based) via `web/lib/auth.tsx`. `useAuth()` in client components.
- Server: `web/lib/server/session.ts` — `getCurrentUser(req)` validates the PB cookie server-side by calling PB as admin.

## Environment

See `web/.env.example` (rename from `.env.local`). Required for full functionality:
- `NEXT_PUBLIC_PB_URL`, `PB_ADMIN_EMAIL`, `PB_ADMIN_PASSWORD`
- `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- `DOCUMENSO_BASE_URL`, `DOCUMENSO_API_TOKEN`, `DOCUMENSO_WEBHOOK_SECRET`, `DOCUMENSO_LOI_TEMPLATE_ID`, `DOCUMENSO_APA_TEMPLATE_ID`

## Deal state machine

```
negotiating → loi_sent → loi_signed → apa_sent → apa_signed
  → funds_held → handover_confirmed → completed
                                                  ↘ disputed → refunded
              ↓ (anywhere pre-funding)
            declined
```

- LOI/APA transitions driven by **Documenso webhooks**.
- `funds_held` set by **Stripe `payment_intent.succeeded` webhook**.
- `handover_confirmed` requires both buyer + seller confirmation; then `stripe.transfers.create` releases the seller's cut.
- Platform fee stays as residual on platform balance.

## Free-tier deployment

See `docs/DEPLOY-FREE.md`.
