# Brickfund

Marketplace connecting **brick-and-mortar businesses** with investors. Listings carry clear investment-type pills (Seed, Growth, Loan, Equity, Revenue Share, Convertible Note). Deals move through LOI → APA → Stripe escrow → dual handover → release.

| | Production | Local defaults |
|--|------------|----------------|
| App | https://brick-fund.com | http://127.0.0.1:3001 |
| API (PocketBase) | https://api.brick-fund.com | http://127.0.0.1:8093 |
| Branches | `master` (prod) · `dev` (staging) | either |

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16 (App Router), React 19, Tailwind v4 |
| Backend | PocketBase (SQLite + REST + auth) |
| Payments | Stripe Connect Express + PaymentIntents (escrow) |
| E-sign | Documenso CE (optional until configured) |
| Hosting (this repo) | systemd user units + Cloudflare Tunnels on Pi |

---

## Features

- Role-based auth (business / investor)
- Public marketplace with filters (type, city, search)
- Business dashboard: create, publish/hide, delete listings
- Investor deal room: LOI/APA, fund escrow, confirm handover, dispute/refund
- i18n (11 locales)
- Legal pages: Terms, Privacy, Risk

---

## Quick start

### 1. Backend

```bash
cd backend
./setup.sh          # migrate + superuser + serve (default :8090 in script; prod unit uses :8093)
```

Superuser: set `PB_ADMIN_EMAIL` / `PB_ADMIN_PASSWORD`. Local `setup.sh` may create a **dev-only** default — never reuse on the public internet. See [docs/CREDENTIALS.md](docs/CREDENTIALS.md).

### 2. Frontend

```bash
cd web
cp .env.example .env.local   # fill values — see docs/ENV_MATRIX.md
npm install
npm run dev                  # http://localhost:3000
# production-style:
npm run build && npm run start   # PORT=3001 in systemd
```

### 3. Optional: Documenso

```bash
docker compose up -d         # see docker-compose.yml — do not bind the same port as Next prod
```

### 4. Stripe webhooks (local)

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Deal flow

```
Investor starts deal          → negotiating
Send LOI (Documenso)          → loi_sent → loi_signed
Send APA                      → apa_sent → apa_signed
Buyer funds PaymentIntent     → funds_held  (+ fundingRaised++)
Both confirm handover         → handover_confirmed → Transfer → completed
```

Platform fee: `PLATFORM_FEE_PERCENT` (default 3%). Seller receives `priceCents` via Transfer with `source_transaction`.

---

## Project layout

```
brickfund/
├── backend/
│   ├── pocketbase                 # linux aarch64 binary (do not commit foreign binaries)
│   ├── pb_migrations/             # schema as code
│   ├── setup.sh / start.sh
│   └── pb_data/                   # gitignored
├── web/                           # Next.js app
│   ├── app/                       # routes + api/*
│   ├── components/
│   └── lib/                       # auth, i18n, server/*
├── docs/                          # operator + product docs
├── scripts/                       # smoke tests
├── .github/workflows/ci.yml
└── docker-compose.yml             # Documenso + Postgres
```

---

## Documentation

| Doc | Purpose |
|-----|---------|
| [docs/README.md](docs/README.md) | Doc index |
| [docs/ENV_MATRIX.md](docs/ENV_MATRIX.md) | Required environment variables |
| [docs/CREDENTIALS.md](docs/CREDENTIALS.md) | Password / secret hygiene |
| [docs/PRODUCTION_READINESS_CHECKLIST.md](docs/PRODUCTION_READINESS_CHECKLIST.md) | Go-live gate |
| [docs/DISPUTE_RUNBOOK.md](docs/DISPUTE_RUNBOOK.md) | Escrow dispute ops |
| [docs/DEPLOY-FREE.md](docs/DEPLOY-FREE.md) | Low-cost deploy options |
| [docs/MARKETING_STRATEGY_FIRST_USERS.md](docs/MARKETING_STRATEGY_FIRST_USERS.md) | GTM for first users |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design |
| [docs/PROJECT_REVIEW.md](docs/PROJECT_REVIEW.md) | Latest full review |

---

## Demo accounts (local seed only)

| Role | Email | Password |
|------|-------|----------|
| Business | `business@brickfund.local` | set in seed — **dev only** |
| Investor | `investor@brickfund.local` | set in seed — **dev only** |

Delete or rotate these on any shared/production database.

---

## Development

```bash
cd web
npm run dev
npm run build
npm run lint
npx tsx ../scripts/smoke-deal-transitions.ts
```

---

## License

MIT.

Crafted for main street.
