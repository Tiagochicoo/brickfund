# Production Readiness Checklist

Use before enabling real investments on brick-fund.com.

## Auth & session

- [ ] PocketBase token synced to httpOnly cookie or Authorization header on every API call
- [ ] Server `getCurrentUser` does not mutate admin singleton authStore
- [ ] Login/register/logout cookie lifecycle verified in browser (full flow, not curl-only)
- [ ] Token refresh / expiry handled

## Schema

- [ ] `city` / `country` fields in migrations
- [ ] `deals`, `deal_events`, `webhook_events`, `stripe_accounts` in migrations
- [ ] Fresh `pb_migrations` apply on empty DB
- [ ] Collection rules: deals party-only; users not fully public; owner forced on create

## Money path

- [ ] Stripe keys + webhook secret present in prod
- [ ] Publishable key in client env
- [ ] Currency aligned (EUR vs USD)
- [ ] Connect country matches seller geography
- [ ] Handover role forced from authenticated party
- [ ] Refund requires dual consent or admin
- [ ] `fundingRaised` updates on completed funding
- [ ] Dispute path documented + admin runbook

## E-sign

- [ ] Documenso up + API token
- [ ] LOI + APA template IDs
- [ ] Webhook secret **required** in prod
- [ ] End-to-end sign test on staging

## Product

- [ ] Business can create/edit/publish listing
- [ ] Investor can start deal and see it on `/deals`
- [ ] Dashboard links to deals + onboarding
- [ ] No fake metrics without label
- [ ] Risk disclosure + Terms + Privacy pages

## Ops

- [ ] `npm run start` (prod), not `dev`
- [ ] `PB_ADMIN_*` set for API routes
- [ ] Backups of `pb_data`
- [ ] Log alerts on webhook 500s
- [ ] Demo passwords rotated / disabled in prod

## Quality

- [ ] Smoke tests: register, list, deal create, webhook signature fail, handover spoof blocked
- [ ] CI on PR
