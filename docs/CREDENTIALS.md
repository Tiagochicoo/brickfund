# Credentials hygiene

## Production
- Never use `admin@brickfund.local` / `brickfund1234` on a public host.
- Set strong unique `PB_ADMIN_EMAIL` + `PB_ADMIN_PASSWORD` and store only in server env / secret manager.
- Rotate Stripe and Documenso secrets if they ever appeared in chat logs or commits.
- Demo users from seed (`business@brickfund.local`, `investor@brickfund.local`) should be **deleted or password-rotated** on production databases.

## Local dev
- `backend/setup.sh` / `start.sh` may upsert a default superuser for convenience.
- Acceptable on loopback only.

## Checklist
- [ ] Prod admin password ≠ default
- [ ] Demo seed users disabled on prod
- [ ] `.env.local` not committed
- [ ] Webhook secrets required in prod
