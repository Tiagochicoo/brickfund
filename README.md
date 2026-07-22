# Brickfund

This marketplace connects local businesses with investors. Businesses list opportunities. Investors fund deals through escrow.

## URLs and ports

| Environment | App URL | API URL |
|-------------|---------|---------|
| Production | https://brick-fund.com | https://api.brick-fund.com |
| Local | http://127.0.0.1:3001 | http://127.0.0.1:8093 |

The `master` branch is for production. The `dev` branch is for staging.

## Software components

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, Tailwind v4 |
| Backend | PocketBase (SQLite database) |
| Payments | Stripe Connect (escrow) |
| E-signatures | Documenso (optional) |
| Hosting | systemd, Cloudflare Tunnels |

## Main features

- Users register as businesses or investors
- Public listings with filters
- Business dashboard to create listings
- Deal room for investors (LOI, APA, funding, handover)
- Support for 11 languages
- Legal pages (Terms, Privacy, Risk)

## How to start

### Step 1: Start the backend

Run these commands:

```bash
cd backend
./setup.sh
```

This script runs migrations and starts PocketBase. The default port is 8090. Production uses port 8093.

Set the `PB_ADMIN_EMAIL` and `PB_ADMIN_PASSWORD` environment variables. Do not use default passwords in production. See [docs/CREDENTIALS.md](docs/CREDENTIALS.md).

### Step 2: Start the frontend

Run these commands:

```bash
cd web
cp .env.example .env.local
npm install
npm run dev
```

The app runs at http://localhost:3000.

For production, run:

```bash
npm run build
npm run start
```

The production port is 3001.

See [docs/ENV_MATRIX.md](docs/ENV_MATRIX.md) for required environment variables.

### Step 3: Start Documenso (optional)

Run this command:

```bash
docker compose up -d
```

Documenso uses port 3100. Do not use the same port as the frontend.

### Step 4: Test Stripe webhooks (local)

Run this command:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## How a deal works

1. Investor starts a deal → State: `negotiating`
2. Business sends LOI → State: `loi_sent` → Investor signs → State: `loi_signed`
3. Business sends APA → State: `apa_sent` → Investor signs → State: `apa_signed`
4. Investor pays → State: `funds_held`
5. Both parties confirm handover → State: `completed` → Funds transfer to seller

The platform fee is 3% by default. Set the `PLATFORM_FEE_PERCENT` variable to change this.

## Project structure

```
brickfund/
├── backend/
│   ├── pocketbase (binary)
│   ├── pb_migrations/ (database schema)
│   ├── setup.sh
│   └── pb_data/ (database files)
├── web/ (Next.js app)
│   ├── app/ (pages and API routes)
│   ├── components/ (UI components)
│   └── lib/ (shared code)
├── docs/ (documentation)
├── scripts/ (test scripts)
├── .github/workflows/ci.yml
└── docker-compose.yml
```

## Documentation

| Document | Purpose |
|----------|---------|
| [docs/README.md](docs/README.md) | Documentation index |
| [docs/ENV_MATRIX.md](docs/ENV_MATRIX.md) | Environment variables |
| [docs/CREDENTIALS.md](docs/CREDENTIALS.md) | Password and secret security |
| [docs/PRODUCTION_READINESS_CHECKLIST.md](docs/PRODUCTION_READINESS_CHECKLIST.md) | Go-live checklist |
| [docs/DISPUTE_RUNBOOK.md](docs/DISPUTE_RUNBOOK.md) | How to resolve disputes |
| [docs/DEPLOY-FREE.md](docs/DEPLOY-FREE.md) | Low-cost deployment |
| [docs/MARKETING_STRATEGY_FIRST_USERS.md](docs/MARKETING_STRATEGY_FIRST_USERS.md) | How to get first users |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design |
| [docs/PROJECT_REVIEW.md](docs/PROJECT_REVIEW.md) | Latest review |

## Demo accounts

These accounts exist for local testing only. Do not use them in production.

| Role | Email | Password |
|------|-------|----------|
| Business | `business@brickfund.local` | See seed script |
| Investor | `investor@brickfund.local` | See seed script |

Delete these accounts before you go live.

## Development commands

```bash
cd web
npm run dev
npm run build
npm run lint
npx tsx ../scripts/smoke-deal-transitions.ts
```

## License

MIT.

Crafted for main street.