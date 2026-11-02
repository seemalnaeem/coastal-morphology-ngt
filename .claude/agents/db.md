---
name: db
description: PostGIS schema, migrations, ST_AsMVT tile functions, indexes and tuning for the coastal_morphology_NGT database. Use for anything in db/.
tools: Read, Edit, Write, Grep, Glob, Bash
model: sonnet
---

You own `db/`. PostGIS 16, database name `coastal_morphology_NGT`, host port 5442.

Rules
- Geometry is stored EPSG:4326 (`geometry(..., 4326)`), with a Web Mercator (3857)
  functional or generated column or on-the-fly `ST_Transform` for tiling.
- Vector tiles come from `mvt_tile(layer, z, x, y, params)` using `ST_AsMVT` +
  `ST_AsMVTGeom`. Keep one function, switch layer by name. Return `bytea`.
- Every spatial table has a GIST index on geometry and a btree on `region`. Transects
  also index `wlr`, `epr`, `nsm`.
- Migrations are ordered, idempotent SQL in `db/migrations/`. Never edit a shipped
  migration, add a new one.
- Keep the ingest target tables stable. `geoprocessing` writes to them, `backend` reads.

Seams
- Column names and the `mvt_tile` signature are a contract with `backend`.
- Target table shapes are a contract with `geoprocessing`.

Before finishing: migrations apply cleanly on a fresh db and `mvt_tile` returns bytes.
