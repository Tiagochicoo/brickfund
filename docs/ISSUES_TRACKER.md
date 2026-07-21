# GitHub Issues — Project Review Tracker

Status synced from GitHub after P0 push to master/dev.

| # | State | Priority | Title |
|---|-------|----------|-------|
| #9 | **CLOSED** | P0 | [P0] Wire client auth to server API (cookie or Bearer) — deals currently 401 |
| #10 | **CLOSED** | P0 | [P0] Isolate admin PocketBase client from user cookie loadFromCookie |
| #11 | **CLOSED** | P0 | [P0] Fix /deals server page cookie read (document is undefined) |
| #12 | **CLOSED** | P0 | [P0] Handover confirm: prevent role spoofing (single party can release funds) |
| #13 | **CLOSED** | P0 | [P0] Make deal state transitions concurrency-safe |
| #14 | **CLOSED** | P0 | [P0] Refund must not be unilateral — require dual consent or admin |
| #15 | **OPEN** | P0 | [P0] Add missing PocketBase migrations (city/country + deals collections) |
| #16 | **OPEN** | P0 | [P0] Complete production env (PB admin, Documenso, app URL, Stripe publishable) |
| #17 | **OPEN** | P1 | [P1] Enable business listing creation (dashboard New listing is disabled) |
| #18 | **OPEN** | P1 | [P1] Align currency and Stripe Connect country with EU marketplace (EUR) |
| #19 | **OPEN** | P1 | [P1] Update fundingRaised when deals complete (progress bars are stale) |
| #20 | **CLOSED** | P1 | [P1] Enforce investor role on POST /api/deals + amount vs remaining goal |
| #21 | **CLOSED** | P1 | [P1] Require Documenso webhook secret in production |
| #22 | **OPEN** | P1 | [P1] Tighten PocketBase rules (users view public; business owner on create) |
| #23 | **OPEN** | P1 | [P1] Remove or label fake landing-page stats (€4.2M / 120+ / 800+) |
| #24 | **OPEN** | P2 | [P2] Add CI + smoke tests for auth and deal transitions |
| #25 | **OPEN** | P2 | [P2] Legal/compliance pages: risk disclosure, terms, privacy |
| #26 | **OPEN** | P2 | [P2] i18n hard-coded English on deals pages |
| #27 | **OPEN** | P2 | [P2] Admin dispute resolution runbook + UI stub |
| #28 | **OPEN** | P3 | [P3] Rotate demo credentials; never ship default admin password in prod docs |

## Closed after code push (`b21df09` on master/dev)
- #9 auth bridge
- #10 admin session isolation
- #11 /deals list page
- #12 handover role spoof
- #13 transition concurrency
- #14 buyer-only refund
- #20 investor role + amount cap
- #21 Documenso webhook secret in prod

## Still open (not closed — remaining work)
- **P0:** #15 migrations, #16 prod env
- **P1:** #17 listing UI, #18 currency/geo, #19 fundingRaised, #22 PB rules, #23 fake stats
- **P2/P3:** #24 CI, #25 legal, #26 deals i18n, #27 dispute admin, #28 demo passwords

See [PROJECT_REVIEW_2026_07_21.md](./PROJECT_REVIEW_2026_07_21.md).
