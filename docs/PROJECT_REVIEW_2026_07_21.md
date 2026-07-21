# Brickfund — Comprehensive Project Review

**Date:** 2026-07-21  
**Repo:** `Tiagochicoo/brickfund`  
**Scope:** Full-stack logic, security, money path, product completeness, ops  
**Method:** Static code review + live service inspection + schema/migration audit  
**Priority system:** P0 (blocks money/auth/prod) → P1 (major gaps) → P2 (important) → P3 (nice-to-have)

---

## 1. Executive summary

Brickfund is an ambitious marketplace: brick-and-mortar businesses raise capital from investors, with a sophisticated deal room (LOI → APA → Stripe escrow → dual handover → transfer). The **frontend brand and marketplace UX are strong**; the **deal/money path has critical logic and wiring holes** that prevent a trustworthy launch.

| Area | Grade | Verdict |
|------|-------|---------|
| Brand / landing / i18n | A− | Premium UI, multi-locale, clear value props |
| Marketplace browse | B+ | Works for published seed data |
| Auth (client) | B | PocketBase email/password works client-side |
| Auth (server/API) | **F** | Cookie never exported; server routes cannot see user |
| Deal state machine | C | Good design on paper; concurrency + role bugs |
| Stripe escrow | C− | Code exists; env incomplete; currency/geo wrong for EU |
| Documenso e-sign | D | Optional webhook secret; templates/env likely missing |
| Listing creation | **F** | “New listing” intentionally disabled |
| Schema as code | **D** | Deals/city migrations missing from repo |
| Ops / prod env | **D** | Partial `.env.local`; admin/Documenso keys absent |
| Tests / CI | F | No automated test suite or GitHub Actions |
| Compliance readiness | F | No securities disclaimers, KYC, or risk copy |

**Bottom line:** Do **not** take real money until P0 auth + money-path issues are closed. Marketing can start with waitlist/education; live investing should stay gated.

---

## 2. Architecture snapshot

```
Browser ──► Next.js (:3001 prod) ──► API routes (deals, webhooks, sellers)
                │                         │
                │ client PB SDK           │ admin PB singleton
                ▼                         ▼
         PocketBase (:8093) ◄──── Cloudflare tunnel ── api.brick-fund.com
                │
         SQLite (pb_data)

Stripe webhooks ──► /api/webhooks/stripe
Documenso     ──► /api/webhooks/documenso   (if configured)
```

**Intended deal flow**

1. Investor starts deal → `negotiating`  
2. LOI via Documenso → `loi_sent` → `loi_signed`  
3. APA → `apa_sent` → `apa_signed`  
4. Buyer funds PI → webhook → `funds_held`  
5. Both confirm handover → transfer → `completed`

---

## 3. Critical logic holes (detail)

### 3.1 Server auth is disconnected from the client (P0)

- Client auth uses PocketBase `authStore` (typically **localStorage**).
- There is **no** `exportToCookie` / cookie sync anywhere in the web app.
- `getCurrentUser(req)` expects a `pb_auth` cookie on the request.
- `StartDealButton` calls `fetch("/api/deals")` **without** `credentials` and without a Bearer token.

**Impact:** Create deal, fund, sign LOI/APA, confirm handover, seller onboard almost certainly return **401** for real browser sessions.

**Evidence:** `web/lib/auth.tsx`, `web/lib/server/session.ts`, `web/components/deals/StartDealButton.tsx`.

---

### 3.2 Admin PocketBase singleton polluted by user cookies (P0)

`getCurrentUser` does:

```ts
const pb = await adminPb();
pb.authStore.loadFromCookie(cookie);
```

`adminPb()` is a **process-wide singleton**. Loading a user cookie onto it can demote or race the superuser session used by all API routes and webhooks.

**Impact:** Intermittent 401/403, failed transitions, webhook processing under wrong identity.

---

### 3.3 `/deals` server page never sees cookies (P0)

```ts
const cookieHeader = typeof document === "undefined" ? null : document.cookie;
```

In a Server Component, `document` is undefined → always `null` → empty deals list forever.

---

### 3.4 Handover confirmation role spoofing (P0)

`confirm-handover` accepts `body.role` and does **not** force `role` to match the authenticated party:

```ts
const role = body.role ?? (isBuyer ? "buyer" : "seller");
// buyer can send role: "seller" and stamp sellerConfirmedAt
```

**Impact:** One party can forge dual confirmation and trigger fund release.

---

### 3.5 State transitions are not concurrency-safe (P0)

`transition()` comments claim optimistic concurrency with a filter, but the update is:

```ts
await pb.collection("deals").update(dealId, { state: to });
```

No `filter: state = expected`. Two concurrent webhooks/actions can double-apply side effects.

---

### 3.6 Unilateral refund (P0)

`POST .../resolve` with `action: "refund"` allows **either** buyer or seller to refund from `funds_held` / `disputed` with no mutual consent or admin gate.

---

### 3.7 `fundingRaised` never advances on completed deals (P0/P1)

Marketplace progress bars use `fundingRaised` from PocketBase. Completing a deal does not increment this field. Progress is static seed data → **misleading investors**.

---

### 3.8 Schema migrations incomplete in git (P0)

README lists:

- `1739800003_add_city_country.js`
- `1739800004_create_deal_collections.js`

**Only** `0000`–`0002` exist under `backend/pb_migrations/`. Fresh installs lack city/country and deals/stripe/webhook collections as code. Production may have been mutated via Admin UI only → **non-reproducible deploys**.

---

### 3.9 Production env incomplete (P0)

Live `web/.env.local` only defines:

- `PB_URL`, `NEXT_PUBLIC_PB_URL`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

**Missing:** `PB_ADMIN_EMAIL`, `PB_ADMIN_PASSWORD`, Documenso vars, `NEXT_PUBLIC_APP_URL`, publishable Stripe key, etc. Admin API client cannot auth; LOI/APA cannot send.

---

### 3.10 Currency & geo mismatch (P1)

- UI formats money as **EUR** (`formatCurrency`).
- Deals create with `currency: "usd"`.
- Stripe Express onboarding hardcodes `country: "US"`.
- Seed listings are Lisbon/Porto/Madrid/Barcelona.

**Impact:** EU-first product with US payment rails and mixed currency labels.

---

### 3.11 Product blockers for first users (P1)

| Gap | Detail |
|-----|--------|
| New listing | Dashboard button `disabled` — businesses cannot list |
| Investor deals UI | Broken cookie path; hard-coded English copy |
| Fake social proof | Landing stats “€4.2M / 120+ / 800+” not data-backed |
| Role on API | POST `/api/deals` does not require `role === investor` |
| Documenso webhook | If secret unset, accepts unauthenticated POSTs |
| Users privacy | `users.viewRule = ""` (public view) in base migration |
| Business create rule | Does not force `owner = @request.auth.id` |
| No tests/CI | No regression net on money path |

---

## 4. Positive findings (keep)

- Clear deal state machine vocabulary and event log concept.
- Stripe webhook signature verification present.
- Webhook idempotency collection design (`webhook_events`).
- Transfer uses `source_transaction` + idempotency keys (good money hygiene when path works).
- Premium design system (brand greens + gold, Fraunces, AuthShell).
- Investment-type pills and i18n scaffold (11 locales).
- RBAC intent for businesses list/create is directionally correct.
- Dual Cloudflare tunnels for frontend + API.

---

## 5. Risk register (launch)

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| Fund release via spoofed handover | Critical | High if API reachable | Force role from auth identity |
| Unauthorized refund | Critical | Medium | Dual consent or admin-only |
| Auth bypass / always-401 | Critical | Certain today | Cookie/token bridge |
| Securities regulation (EU/PT/US) | Critical | Certain if live raise | Legal structure + disclaimers + accredited gates |
| Misleading funding % | High | Certain | Wire `fundingRaised` or hide bar until live |
| Schema drift | High | On any rebuild | Commit migrations 0003/0004 |
| Demo passwords in docs | Medium | High | Rotate + env-only secrets |

---

## 6. Recommended fix order

1. **P0 auth bridge** — cookie or `Authorization` header end-to-end  
2. **P0 admin client isolation** — never load user cookie onto admin singleton  
3. **P0 handover + refund safeguards**  
4. **P0 migrations for deals + city/country**  
5. **P0 env checklist + secrets** for production  
6. **P1 listing create UI**  
7. **P1 EUR/Stripe country alignment**  
8. **P1 fundingRaised updates**  
9. **P1/P2 compliance copy + waitlist mode**  
10. **P2 CI smoke tests on deal transitions**

---

## 7. GitHub tracking

Issues created from this review are labeled `P0`–`P3`, `logic-hole`, `security`, `product`, or `infra`.  
Implementation proceeds issue-by-issue on `master` + `dev` after each fix.

See also:

- [`docs/MARKETING_STRATEGY_FIRST_USERS.md`](./MARKETING_STRATEGY_FIRST_USERS.md)
- [`docs/PRODUCTION_READINESS_CHECKLIST.md`](./PRODUCTION_READINESS_CHECKLIST.md)

---

## 8. Appendix — files reviewed (primary)

| Path | Why |
|------|-----|
| `web/lib/server/deals.ts` | State machine, release, refund |
| `web/lib/server/session.ts` | Server auth |
| `web/lib/auth.tsx` / `pb.ts` | Client auth |
| `web/app/api/deals/**` | Deal APIs |
| `web/app/api/webhooks/**` | Stripe/Documenso |
| `web/app/deals/page.tsx` | Deals list SSR bug |
| `web/app/dashboard/page.tsx` | Listing disabled |
| `web/components/deals/StartDealButton.tsx` | Deal create UX |
| `backend/pb_migrations/*` | Schema as code |
| `web/.env.local` (keys only) | Prod config gap |
| systemd `brickfund-*.service` | Runtime mode |

---

*End of review report.*
