# Backend API contract

Base URL in dev: `http://localhost:3046`. All errors use `{ "error": { "code", "message" } }`.

## Health
`GET /api/health` -> `{ "status": "ok", "db": true }`

## Layer catalog
`GET /api/layers` -> regions, vector layers, raster layers, and the classification
(breaks, colors, labels, slr ramp). The frontend builds its layer control and legend
from this so styling stays in one place.

## Stats
`GET /api/stats?region=sindh` (region optional) ->
```json
{ "stats": [ { "region": "sindh", "transects": 1202, "meanEpr": -0.8,
  "meanNsm": -12.1, "pctEroding": 61.2, "pctAccreting": 38.8,
  "maxErosion": -6.4, "maxAccretion": 5.1 } ] }
```

## Vector tiles
`GET /tiles/:layer/:z/:x/:y.pbf?region=sindh`
- `:layer` one of transect, shoreline, baseline, forecast_line, forecast_uncertainty
- `region` optional filter
- 200 `application/x-protobuf` with the tile, 204 for an empty tile
- `Cache-Control: public, max-age=<TILE_CACHE_SECONDS>`

## Raster tiles
Not served here. The SLR raster is served by TiTiler on port 3048, for example
`GET http://localhost:3048/cog/tiles/WebMercatorQuad/{z}/{x}/{y}.png?url=file:///data/cog/slr_impact.tif`.
