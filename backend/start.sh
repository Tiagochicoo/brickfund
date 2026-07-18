#!/usr/bin/env bash
cd "$(dirname "$0")"

# Run migrations (safe to run multiple times)
./pocketbase migrate up || true

# Ensure superuser exists (idempotent)
./pocketbase superuser upsert admin@brickfund.local brickfund1234 || true

# Start server (this blocks)
exec ./pocketbase serve --http=0.0.0.0:8093