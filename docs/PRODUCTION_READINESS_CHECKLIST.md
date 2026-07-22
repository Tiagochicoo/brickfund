# Production readiness checklist

Use this checklist before you enable real investments on brick-fund.com.

## Authentication

- [ ] PocketBase token is sent in a cookie or Authorization header on every API call.
- [ ] Server code does not change the admin client auth state.
- [ ] Login, register, and logout work in the browser.
- [ ] Token refresh and expiry work correctly.

## Database

- [ ] Migrations add `city` and `country` fields.
- [ ] Migrations create `deals`, `deal_events`, `webhook_events`, and `stripe_accounts`.
- [ ] Migrations work on an empty database.
- [ ] Collection rules restrict deal access to parties.
- [ ] User accounts are not fully public.
- [ ] Listing creation forces the correct owner.

## Payments

- [ ] Stripe keys and webhook secret are set in production.
- [ ] Stripe publishable key is in the client environment.
- [ ] Currency settings are correct (EUR, not USD).
- [ ] Stripe Connect country matches the seller location.
- [ ] Handover confirmation requires the correct party.
- [ ] Refunds require buyer consent or admin action.
- [ ] `fundingRaised` updates when funding completes.
- [ ] Dispute process is documented.

## E-signatures

- [ ] Documenso server is running.
- [ ] Documenso API token is set.
- [ ] LOI and APA template IDs are set.
- [ ] Documenso webhook secret is set in production.
- [ ] You tested the full sign flow on staging.

## Product features

- [ ] Businesses can create, edit, and publish listings.
- [ ] Investors can start deals and see them on `/deals`.
- [ ] Dashboard links to deals and onboarding.
- [ ] Fake metrics are labeled as estimates.
- [ ] Risk disclosure, Terms, and Privacy pages exist.

## Operations

- [ ] Production runs `npm run start`, not `npm run dev`.
- [ ] `PB_ADMIN_EMAIL` and `PB_ADMIN_PASSWORD` are set.
- [ ] Database backups of `pb_data` exist.
- [ ] You monitor webhook errors.
- [ ] Demo passwords are changed or disabled.

## Quality

- [ ] You tested registration, listing, deal creation, and handover.
- [ ] You tested that webhook signature failures block access.
- [ ] CI runs on pull requests.