# Brickfund

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

| Layer    | Technology                                      |
| -------- | ----------------------------------------------- |
| Frontend | Next.js 16 (App Router), React 19, Tailwind v4 |
| Icons    | lucide-react                                    |
| Backend  | PocketBase v0.39 (embedded SQLite + REST API)  |
| Auth     | PocketBase auth (email/password, role-based)   |

## 📁 Project Structure

```
brickfund/
├── backend/
│   ├── pocketbase              # precompiled binary (macOS arm64)
│   ├── pb_migrations/
│   │   ├── 1739800000_create_collections.js   # schema (users + businesses)
│   │   ├── 1739800001_set_business_rules.js   # API access rules
│   │   └── 1739800002_seed_data.js            # 6 sample businesses + 2 users
│   ├── setup.sh                # one-command bootstrap
│   └── pb_data/                # auto-generated (gitignored)
│
└── web/
    ├── app/
    │   ├── page.tsx            # landing page (hero, featured listings, CTA)
    │   ├── businesses/
    │   │   ├── page.tsx        # marketplace (filter + search)
    │   │   └── [id]/page.tsx   # business detail
    │   ├── login/              # login page
    │   ├── register/           # register (business/investor toggle)
    │   ├── forgot-password/    # password reset request
    │   ├── logout/             # clears session, redirects
    │   ├── dashboard/          # role-aware dashboard
    │   └── not-found.tsx       # 404
    ├── components/
    │   ├── Navbar.tsx          # responsive nav with auth state
    │   ├── Footer.tsx
    │   ├── BusinessCard.tsx    # listing card with funding progress
    │   ├── InvestmentPill.tsx  # colored type badge
    │   ├── AuthShell.tsx       # split-screen layout for auth pages
    │   ├── Logo.tsx
    │   └── ui.tsx              # Input, Button, Label primitives
    └── lib/
        ├── pb.ts               # PocketBase client singleton
        ├── auth.tsx            # AuthProvider + useAuth (useSyncExternalStore)
        ├── api.ts              # server-side data fetching
        ├── types.ts            # shared TypeScript types
        └── constants.ts        # investment types, categories, formatters
```

## 🚀 Quick Start

### 1. Backend (PocketBase)

```bash
cd backend
./setup.sh
```

This runs migrations, creates a superuser, and starts the server at `http://127.0.0.1:8090`.

- **Admin dashboard:** http://127.0.0.1:8090/_/
- **Superuser:** `admin@brickfund.local` / `brickfund1234`

### 2. Frontend (Next.js)

```bash
cd web
npm install
npm run dev
```

Open http://localhost:3000

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

## 🏪 Seeded Businesses

1. **Bella Vista Trattoria** — Restaurant, Growth — expanding terrace
2. **Sharp & Co. Barbershop** — Barber, Loan — relocating
3. **Iron Temple Gym** — Gym, Seed — new opening
4. **Morning Glory Café** — Café, Revenue Share — second location
5. **Bloom & Co.** — Retail, Equity — scaling to 3 neighborhoods
6. **Crust Artisan Bakery** — Bakery, Convertible Note — new ovens

## 💻 Development

```bash
cd web
npm run dev      # dev server
npm run build    # production build
npm run lint     # eslint
```

## 🔐 API Access Rules

**Users collection:**
- List: authenticated only
- View: public (email field hidden by default)
- Create: open (registration)
- Update/Delete: own record only

**Businesses collection:**
- List/View: published listings are public; investors + owners see all
- Create: business role only
- Update/Delete: owner only

## 📄 License

MIT

---

Crafted for main street.