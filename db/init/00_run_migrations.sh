#!/bin/bash
# Applies every migration in order on first boot. Migrations are idempotent so this is
# also safe to run against an existing database (see scripts/db-migrate).
set -e

for f in /migrations/*.sql; do
  echo "coastal_morphology: applying migration $(basename "$f")"
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f "$f"
done

echo "coastal_morphology: migrations complete"
