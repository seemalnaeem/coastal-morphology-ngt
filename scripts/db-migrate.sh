#!/bin/bash
# Apply all migrations against the running db (idempotent). Use after adding a migration
# without recreating the volume.
set -e
for f in db/migrations/*.sql; do
  echo "applying $(basename "$f")"
  docker compose exec -T db psql -v ON_ERROR_STOP=1 -U "${POSTGRES_USER:-coastal}" -d "${POSTGRES_DB:-coastal_morphology_NGT}" < "$f"
done
echo "done"
