# Deploy for $0/month

Brickfund runs entirely on free tiers. Production deployment:

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Vercel         │     │  PocketBase      │     │  Fly.io / Oracle │
│  (Next.js 16)   │────▶│  binary           │    │  Always Free VM  │
│  free hobby     │     │  free (SQLite)   │     │  (Documenso CE)  │
└────────┬────────┘     └──────────────────┘     └────────┬─────────┘
         │                                               │
         ▼                                               ▼
   ┌─────────────┐                                ┌──────────────┐
   │  Stripe     │                                │  Resend      │
   │  Connect    │                                │  3k emails   │
   │  (pay-per-  │                                │   free/mo    │
   │   txn only) │                                └──────────────┘
   └─────────────┘
```

## 1. PocketBase backend (free, ~2 min)

PocketBase is a single binary. Run it on any small VM (Hetzner CX22 $5/mo, Oracle Always Free, Fly.io free tier, or your own VPS):

```bash
cd backend
./setup.sh                              # local dev
# Production: deploy backend/ to a VM, run behind Caddy/nginx for TLS
```

Superuser: `admin@brickfund.local` / `brickfund1234` (change in production).
Admin UI: `https://your-pb-host/_/`.

## 2. Frontend (Vercel free, ~5 min)

1. Push the repo to GitHub.
2. Import at https://vercel.com/new. Preset auto-detects Next.js 16.
3. Root directory: `web`.
4. Env vars:
   - `NEXT_PUBLIC_PB_URL=https://your-pb-host`
   - `PB_ADMIN_EMAIL`, `PB_ADMIN_PASSWORD`
   - `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
   - `DOCUMENSO_BASE_URL`, `DOCUMENSO_API_TOKEN`, `DOCUMENSO_WEBHOOK_SECRET`
   - `DOCUMENSO_LOI_TEMPLATE_ID`, `DOCUMENSO_APA_TEMPLATE_ID`
   - `NEXT_PUBLIC_APP_URL=https://your-app.vercel.app`
5. Deploy. Vercel Hobby = unlimited static + 100 GB-Hours serverless.

## 3. Stripe Connect (no base cost)

1. https://dashboard.stripe.com → Developers → API Keys → set secret + publishable.
2. Connect → Settings → Express.
3. Webhook: Developers → Webhooks → Add endpoint:
   - URL: `https://your-app.vercel.app/api/webhooks/stripe`
   - Events: `account.updated`, `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`, `transfer.created`, `transfer.reversed`
   - Copy `whsec_…` → `STRIPE_WEBHOOK_SECRET`.

Stripe charges only 2.9% + $0.30 per transaction. No monthly fee. Your platform fee is `PLATFORM_FEE_PERCENT` (default 3%).

## 4. Documenso CE (self-hosted, ~15 min)

Pick one:

### Fly.io (easiest, generous free tier)

3 shared-cpu-1x VMs free forever. Documenso + Fly Postgres fits comfortably.

```bash
fly launch --image documenso/documenso:latest
fly postgres create
fly secrets set NEXTAUTH_SECRET=$(openssl rand -base64 32) \
  NEXT_PRIVATE_ENCRYPTION_KEY=$(openssl rand -base64 32) \
  NEXT_PRIVATE_ENCRYPTION_SECONDARY_KEY=$(openssl rand -base64 32) \
  NEXT_PUBLIC_WEBAPP_URL=https://sign.your-domain.dev \
  NEXT_PRIVATE_DATABASE_URL=postgresql://...@your-pg.internal:5432/documenso \
  NEXT_PRIVATE_SMTP_TRANSPORT=smtp-auth \
  NEXT_PRIVATE_SMTP_HOST=smtp.resend.com \
  NEXT_PRIVATE_SMTP_PORT=465 \
  NEXT_PRIVATE_SMTP_USERNAME=resend \
  NEXT_PRIVATE_SMTP_PASSWORD=re_xxx \
  NEXT_PRIVATE_SMTP_FROM_NAME=Brickfund \
  NEXT_PRIVATE_SMTP_FROM_ADDRESS=noreply@yourdomain.com
```

### Oracle Cloud Always Free

4 ARM Ampere A1 instances, 24 GB RAM, free forever.

```bash
# Ubuntu 22.04 VM, install Docker, then:
git clone https://github.com/yourname/brickfund
cd brickfund
docker compose up -d documenso postgres
# Add Cloudflare Tunnel (cloudflared) for free HTTPS
```

## 5. Email (Resend free)

Documenso needs SMTP for signing emails.

1. https://resend.com → sign in with GitHub.
2. Verify your domain (or use `onboarding@resend.dev` for testing).
3. Get API key (starts with `re_`) → use as `DOCUMENSO_SMTP_PASSWORD`.
4. SMTP:
   - Host: `smtp.resend.com`
   - Port: `465`
   - Username: `resend`
   - Password: `re_yourkey`

Resend free: **3,000 emails/month, 100/day** — plenty at launch.

## 6. Configure Documenso (~10 min)

1. Open your Documenso URL → create admin account.
2. **Settings → API** → generate API key → set `DOCUMENSO_API_TOKEN`.
3. **Team Settings → Webhooks** → Create:
   - URL: `https://your-app.vercel.app/api/webhooks/documenso`
   - Secret: any random string → set `DOCUMENSO_WEBHOOK_SECRET`
   - Events: `DOCUMENT_OPENED`, `DOCUMENT_SIGNED`, `DOCUMENT_RECIPIENT_COMPLETED`, `DOCUMENT_COMPLETED`, `DOCUMENT_REJECTED`
4. Create templates:
   - **LOI** — Letter of Intent PDF, 2 SIGNER recipients (buyer, seller), signature fields each. Note the numeric ID → `DOCUMENSO_LOI_TEMPLATE_ID`.
   - **APA** — Asset Purchase Agreement PDF, same setup. → `DOCUMENSO_APA_TEMPLATE_ID`.

## 7. Run PocketBase migrations

```bash
cd backend && ./setup.sh
# migrations run automatically on first boot
```

## 8. Test end-to-end

1. Visit `/businesses`, register as investor.
2. In another browser, register as business → `/sellers/onboarding` (Stripe Connect).
3. As investor: open a business → "Start an investment deal".
4. Both get Documenso emails. Sign LOI → state advances to `loi_signed`.
5. Send APA. Both sign → `apa_signed`.
6. As investor: Fund escrow with Stripe test card `4242 4242 4242 4242`.
7. Both confirm handover → funds released to business.

## Cost summary

| Service | Free tier | Outgrow at |
|---|---|---|
| Vercel Hobby | Unlimited static, 100 GB-hrs | ~50k MAU |
| PocketBase | Free binary, embedded SQLite | ~1M records |
| Stripe | No base fee | Never |
| Documenso CE | Unlimited signatures | Never |
| Resend | 3k emails/mo | ~1k signed docs/mo |
| Fly.io free | 3 × 256 MB VMs | High-traffic signing |
| Cloudflare R2 (optional) | 10 GB, free egress | ~20k signed PDFs |

**Launch cost: $0/month.** Stripe's 2.9% + $0.30 per transaction comes out of the buyer's payment — not your pocket.

## When you'll need to pay

- **>100 GB Vercel bandwidth**: Vercel Pro $20/mo.
- **>3k Resend emails/mo**: Resend Pro $20/mo (50k emails).
- **PocketBase scale**: Migrate to managed Postgres at $19/mo (Neon) — or just shard.
- **Escrow licensing**: Holding buyer funds >30 days is regulated. Talk to a fintech lawyer once deals exceed ~$25k.
