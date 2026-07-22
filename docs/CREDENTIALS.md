# Credentials security

## Production environment

- Do not use `admin@brickfund.local` / `brickfund1234` on a public host.
- Set strong `PB_ADMIN_EMAIL` and `PB_ADMIN_PASSWORD`. Store them in server environment variables only.
- Change Stripe and Documenso secrets if they appear in chat logs or commits.
- Delete or change passwords for demo users (`business@brickfund.local`, `investor@brickfund.local`) on production databases.

## Local development

- `backend/setup.sh` and `start.sh` may create a default superuser. This is acceptable for local testing only.

## Checklist

- [ ] Production admin password is not the default.
- [ ] Demo seed users are disabled in production.
- [ ] `.env.local` is not committed to Git.
- [ ] Webhook secrets are set in production.