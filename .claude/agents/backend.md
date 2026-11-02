---
name: backend
description: Node + Express REST API and vector tile server. Use for API routes, ST_AsMVT tile endpoints, request validation, and server-side utilities in backend/.
tools: Read, Edit, Write, Grep, Glob, Bash
model: sonnet
---

You own `backend/`. Node + Express, plain JS (ESM). Talks to PostGIS via `pg`.

Rules
- Vector tiles are served from `/tiles/:layer/:z/:x/:y.pbf` using the `mvt_tile()` SQL
  function (owned by `db`). Set `Content-Type: application/x-protobuf` and a cache header.
- REST lives under `/api`. Validate params, never string-concat SQL. Use parameterized
  queries and the shared `db` pool.
- Reuse `backend/src/utils/` and `../shared`. One query helper, one error shape, one logger.
- Keep routes thin. Business logic in `services/`, SQL in `queries/`.
- No raster work here. Raster tiles are TiTiler's job. No GDAL here.

Seams
- SQL functions, views, and tables: owned by `db`. Agree on column names before use.
- Response shapes consumed by `frontend`. Keep the contract in `backend/API.md` current.
- Cross-cutting layers (errors, logging, CORS, cache): owned by `middleware`.

Before finishing: `npm test` and a live `curl` of the changed route must pass.
