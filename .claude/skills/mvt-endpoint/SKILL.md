---
name: mvt-endpoint
description: Add or change a vector tile layer served through ST_AsMVT. Use for tile performance, new attributes in tiles, or a new vector layer.
---

# MVT endpoint

Vector tiles are PostGIS native: `ST_AsMVTGeom` + `ST_AsMVT`, one function `mvt_tile`.

## Pattern (db/functions/mvt_tile.sql)
- Accept `layer text, z int, x int, y int`.
- Compute the tile envelope with `ST_TileEnvelope(z, x, y)`.
- For the layer, select `ST_AsMVTGeom(ST_Transform(geom, 3857), env, 4096, 64, true)`
  plus the attributes that layer needs, filtered by the envelope with `&&`.
- Wrap in `ST_AsMVT(q, '<layer>', 4096, 'geom')` and return `bytea`.

## Keep tiles small
- Only select attributes the map or tooltip uses.
- Filter by `region` when the UI has a region selected (pass as a param).
- Rely on the GIST index. Check with `EXPLAIN` if a tile is slow.

## Backend
The route streams the `bytea` with `Content-Type: application/x-protobuf` and the cache
header. Empty tiles return 204. Never concat the layer name into SQL, whitelist it.
