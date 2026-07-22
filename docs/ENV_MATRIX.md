# Environment variables

| Variable | Purpose | Notes |
|----------|---------|-------|
| `NEXT_PUBLIC_APP_URL` | Redirects and return URLs | Example: `https://brick-fund.com` |
| `NEXT_PUBLIC_PB_URL` | PocketBase client URL | Public API address |
| `PB_URL` | Internal PocketBase URL | Use `http://127.0.0.1:8093` for server calls |
| `PB_ADMIN_EMAIL` | PocketBase superuser email | Required for admin operations |
| `PB_ADMIN_PASSWORD` | PocketBase superuser password | Change this from the default |
| `STRIPE_SECRET_KEY` | Stripe API key | Use test key or live key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook verification | Get this from Stripe Dashboard |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | Browser uses this key |
| `DOCUMENSO_*` | Documenso configuration | Required for e-signatures |
| `PLATFORM_FEE_PERCENT` | Platform fee percentage | Default is `3` |
| `SESSION_SECRET` | Session encryption | Change this in production |

Copy `web/.env.example` to `web/.env.local` and fill in the values.

The system logs a warning at startup if critical variables are missing. The admin client fails if credentials are missing.