# Project review — 2026-07-21 (updated)

Living review of Brickfund after the P0/P1 hardening pass. Supersedes narrative in older dated notes where they conflict.

## Snapshot

| Area | Status |
|------|--------|
| Marketplace UI / brand / i18n | Strong |
| Listing create / manage | Shipped |
| Client → API auth (`apiFetch` + cookie) | Shipped |
| Admin PB isolation | Shipped |
| Handover role spoof / buyer-only refund | Shipped |
| Deal collections migrations | Shipped |
| Deal **detail** SSR load | **Broken** if cookie format ≠ PB export (see issues) |
| Stripe webhook retry after failure | **Bug** (consume-before-success) |
| Server PB URL preference | Prefers public URL over internal `PB_URL` |
| Prod env completeness | Partial (no PB_ADMIN_* in live `.env.local` yet) |
| Docs | Being cleaned this pass |

## What works

- Public browse + filters
- Register/login/dashboard
- New listing flow
- Deal list via `/api/deals`
- State machine helpers + CI smoke
- Legal pages + marketing strategy docs

## Open defect themes (tracked as GitHub issues)

1. Deal room page server load vs `pb_auth` format
2. Webhook idempotency blocks retries after handler errors
3. Internal vs public PocketBase URL for admin client
4. Navbar / deal room remaining hard-coded English
5. Repo hygiene (junk files, binary ignores, `.env.example`)
6. fundingRaised increment safety
7. Documenso default port clash with Next `:3001`

## Ops required (not pure code)

- Set `PB_ADMIN_EMAIL` / `PB_ADMIN_PASSWORD` on the production host
- Stripe publishable key + real webhook endpoint
- Documenso templates when enabling e-sign
- Rotate seed passwords on public PB

## Grade (honest)

**Product shell: B+ · Money path reliability: C+ until webhook retry + deal room SSR fixed · Launch readiness: not yet for real capital.**
