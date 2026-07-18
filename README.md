# Brickfund

> **Branch:** `dev` — local development. URLs default to `http://127.0.0.1:8090` (PocketBase) and `http://localhost:3000` (app).
> The `master` branch carries production URLs (`api.brick-fund.com`, `www.brick-fund.com`).

A premium SaaS marketplace connecting brick-and-mortar businesses with investors.

Businesses list funding opportunities (a restaurant expanding its terrace, a barbershop relocating, a gym raising seed capital). Each listing carries an **investment-type pill** — Seed, Growth, Loan, Equity, Revenue Share, or Convertible Note. Investors browse, filter, and connect.

## 🎨 Features

- **Premium Design**: Evergreen + brass color palette, Fraunces serif display font, split-screen auth layout, animated cards
- **Role-Based Authentication**: Separate flows for businesses and investors with different registration fields
- **Investment-Type Pills**: Visual, color-coded badges for Seed, Growth, Loan, Equity, Revenue Share, Convertible Note
- **Marketplace**: Filterable grid with search, category badges, and funding progress bars
- **Role-Aware Dashboard**: Businesses manage their listings, investors see recommendations
- **RBAC**: PocketBase API rules protect access (public listings, business-only create, owner-only edit)
- **Seeded Data**: 6 sample businesses + 2 demo users for immediate testing

## 🛠 Tech Stack

| Layer         | Technology                                            |
| ------------- | ----------------------------------------------------- |
| Frontend      | Next.js 16 (App Router, Turbopack), React 19.2, Tailwind v4 |
| Icons         | lucide-react                                          |
| Backend (BaaS)| PocketBase v0.39 (embedded SQLite + REST API)         |
| Auth          | PocketBase auth (email/password, role-based)          |
| Payments      | Stripe Connect (Express accounts, separate-charges + escrow) |
| E-signatures  | Documenso Community Edition (self-hosted, free, unlimited) |
| Email         | Resend (Documenso SMTP)                               |

## 💸 Revenue model

Every funded deal pays a platform fee (default 3%, configurable via `PLATFORM_FEE_PERCENT`). Funds are held by Stripe on the platform balance until both parties confirm handover. The seller's share is then released via a Stripe Transfer with `source_transaction` (guarantees the transfer won't fail).

## 📁 Project Structure

```
brickfund/
├── backend/
│   ├── pocketbase                # precompiled binary
│   └── pb_migrations/
│       ├── 1739800000_create_collections.js
│       ├── 1739800001_set_business_rules.js
│       ├── 1739800002_seed_data.js
│       ├── 1739800003_add_city_country.js
│       └── 1739800004_create_deal_collections.js   # deals, deal_events, webhook_events, stripe_accounts
├── web/
│   ├── app/
│   │   ├── businesses/            # public marketplace
│   │   ├── deals/                 # deal room (LOI → APA → escrow → release)
│   │   ├── sellers/onboarding/    # Stripe Connect Express onboarding
│   │   ├── api/
│   │   │   ├── webhooks/stripe/        # Stripe → deal state machine
│   │   │   ├── webhooks/documenso/     # Documenso → deal state machine
│   │   │   ├── deals/[id]/...          # sign-loi, sign-apa, fund, signing-url, confirm-handover, resolve
│   │   │   └── sellers/onboard/        # Stripe Express onboarding link
│   │   ├── dashboard/
│   │   └── ...
│   ├── components/deals/          # DealActions, DealTimeline, StateBadge, StartDealButton
│   └── lib/
│       ├── server/                # env, pb-admin, stripe, documenso, deals, session, types
│       ├── auth.tsx               # client-side PocketBase authStore
│       ├── api.ts                 # public business reads
│       └── ...
├── docker-compose.yml             # Documenso CE + Postgres (PocketBase runs as binary)
└── docs/DEPLOY-FREE.md            # $0/month production deployment guide
```

## 🚀 Quick Start

### 1. Backend (PocketBase)

```bash
cd backend
./setup.sh
```

PocketBase at http://127.0.0.1:8090. Admin UI: `/_/`. Superuser: `admin@brickfund.local` / `brickfund1234`.

### 2. Documenso + Postgres

```bash
# From repo root — Documenso CE on http://localhost:3001
docker compose up -d
```

Open http://localhost:3001, create admin, generate API key → paste into `web/.env.local` as `DOCUMENSO_API_TOKEN`. Create LOI + APA templates, copy IDs into env. See `docs/DEPLOY-FREE.md`.

### 3. Frontend (Next.js 16)

```bash
cd web
npm install
npm run dev
```

Open http://localhost:3000.

### 4. Stripe webhooks (local dev)

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Copy whsec_... into STRIPE_WEBHOOK_SECRET
```

## 🧑 Demo Accounts

| Role     | Email                       | Password         |
| -------- | --------------------------- | ---------------- |
| Business | `business@brickfund.local`  | `brickfund1234`  |
| Investor | `investor@brickfund.local`  | `brickfund1234`  |

## 📊 Investment Types

| Pill             | Use case                                    |
| ---------------- | ------------------------------------------- |
| Seed             | Early-stage / launch capital                |
| Growth           | Expansion of an existing business           |
| Loan             | Debt financing, repaid over time            |
| Equity           | Ownership stake in exchange for capital     |
| Revenue Share    | Investors earn a % of monthly revenue       |
| Convertible Note | Debt that converts to equity at next round  |

## 🤝 Deal flow

```
1. Investor browses /businesses, clicks "Start an investment deal"
2. POST /api/deals creates deal in state=negotiating
3. Either party sends LOI via Documenso → state=loi_sent → loi_signed
4. Either party sends APA → state=apa_sent → apa_signed (binding)
5. Buyer funds escrow via Stripe (separate-charges model) → state=funds_held
6. Both parties click "Confirm handover" → state=handover_confirmed
7. Server calls stripe.transfers.create with source_transaction → state=completed
   Platform fee stays as residual on platform balance.
```

## 💻 Development

```bash
cd web
npm run dev      # dev server (Turbopack)
npm run build    # production build
npm run lint     # eslint (flat config)
```

## 🔐 API Access Rules

**Users collection:** list authenticated only · view public · create open · update/delete own.

**Businesses collection:** published public · create business role · update/delete owner.

**Deals / deal_events:** visible only to buyer, seller, or admin. Created by buyer (via API route that verifies auth cookie + creates as admin).

**Webhook events / stripe_accounts:** admin only.

## 📄 License

MIT.

---

Crafted for main street.