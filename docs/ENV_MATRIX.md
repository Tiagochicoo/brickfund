# Production environment matrix

| Variable | Required for | Notes |
|----------|--------------|-------|
| `NEXT_PUBLIC_APP_URL` | redirects, Documenso return URLs | e.g. `https://brick-fund.com` |
| `NEXT_PUBLIC_PB_URL` | browser PB SDK | public API host |
| `PB_URL` | optional server override | internal `http://127.0.0.1:8093` |
| `PB_ADMIN_EMAIL` | deal API, webhooks | PocketBase superuser |
| `PB_ADMIN_PASSWORD` | deal API, webhooks | rotate from default |
| `STRIPE_SECRET_KEY` | fund / Connect / refunds | test or live |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook verify | from Dashboard |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | escrow Payment Element | browser |
| `DOCUMENSO_*` | LOI / APA | optional until e-sign live |
| `PLATFORM_FEE_PERCENT` | fee calc | default `3` |
| `SESSION_SECRET` | reserved | change in prod |

Template: `web/.env.example`.

Server logs a **warning** at boot in production if critical vars are missing.
`adminPb()` will throw when admin credentials are absent in production.
