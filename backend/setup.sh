#!/usr/bin/env bash
# Brickfund backend bootstrap (idempotent).
# Runs migrations, creates a superuser, starts the server, and seeds.
set -euo pipefail
cd "$(dirname "$0")"

PB_ADMIN_EMAIL="${PB_ADMIN_EMAIL:-admin@brickfund.local}"
PB_ADMIN_PASS="${PB_ADMIN_PASS:-brickfund1234}"
PB_PORT="${PB_PORT:-8090}"

# 1. stop any running instance
pkill -9 -f "pocketbase serve" 2>/dev/null || true
sleep 1

# 2. run migrations (creates collections + rules + seed data)
echo "→ applying migrations…"
./pocketbase migrate up

# 3. create superuser (MUST be done while the server is stopped)
echo "→ ensuring superuser…"
./pocketbase superuser upsert "$PB_ADMIN_EMAIL" "$PB_ADMIN_PASS"

# 4. start server
echo "→ starting PocketBase on http://0.0.0.0:$PB_PORT"
exec ./pocketbase serve --http=0.0.0.0:$PB_PORT
