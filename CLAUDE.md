# Coastal Morphology Portal

A self-contained full-stack portal for shoreline change analysis and sea level rise
along the Pakistan coast (Sindh and Balochistan). Built on the PERN stack with a
Python FastAPI geoprocessing service.

This project is self contained. Do not pull context, config, or code from any other
project on this machine.

## What the data is

Source data lives in `Coastal Morphology/data/` and is classic USGS DSAS output.

- **shoreline** historical shorelines with survey dates and positional uncertainty
- **baseline** reference baselines the transects are cast from
- **transects** DSAS change statistics per transect: EPR, NSM, SCE, LRR, WLR and friends
- **forecast_line** 10 year forecasted shoreline position
- **forecast_uncertainty** 10 year forecast uncertainty polygons
- **slr_impact** Sea Level Rise Impact raster

Regions: `sindh`, `balochistan`. Vectors are EPSG:32642 (WGS84 UTM 42N) and are
reprojected to EPSG:4326 on ingest. The SLR raster is already EPSG:4326.

Sign convention for change rates: negative means erosion (retreat), positive means
accretion (advance). Transects are symbolized on WLR with a red to blue diverging ramp.

## Architecture

| Service        | Stack                         | Host port | Notes                                 |
| -------------- | ----------------------------- | --------- | ------------------------------------- |
| db             | PostGIS 16                    | 5442      | database name `coastal_morphology_NGT`       |
| backend        | Node + Express                | 3046      | REST API + vector tiles via ST_AsMVT  |
| geoprocessing  | Python FastAPI + GDAL/osgeo   | 3047      | shapefile and raster ingest, COG      |
| titiler        | TiTiler                       | 3048      | raster tiles (host 8000 is taken, avoid it) |
| frontend       | React + Vite + Tailwind       | 5182      | Mapbox GL map, react-icons            |

All services run under Docker Compose in the `coastal_morphology` project namespace. These
host ports were picked to avoid the other compose projects already running on this machine
(for example `global-wildfire-portal`), so none of them are overridden. Host port 8000 is
used by another project's tiles, so this project never binds it.

## Division of labor

Five dedicated agents own the stack. See `.claude/agents/`. Keep each change inside
one agent's lane and hand off at the documented seams (REST contract, MVT tile schema,
the SQL views, the ingest output tables).

- `frontend` React, Vite, Tailwind, Mapbox, map UI and theming
- `backend` Express routes, tile endpoints, request validation, shared server utils
- `middleware` cross-cutting Express layers: auth stub, errors, logging, caching, CORS
- `db` PostGIS schema, migrations, ST_AsMVT functions, indexes, tuning
- `geoprocessing` FastAPI, GDAL, ogr2ogr, raster to COG, reprojection

## Conventions

- No em-dashes in code, comments, docs, or UI copy. Use commas or parentheses.
- Shared code goes in `shared/` (JS) and `geoprocessing/app/common/` (Python). Reuse
  before you write. Do not duplicate helpers across services.
- Tailwind for all styling. react-icons for all icons. Never use Lucide.
- Mapbox token is read from env at runtime (`VITE_MAPBOX_TOKEN`), added later.
- All ports, names, and the SRID flow are fixed. Do not change them casually.

## Quick start

```bash
cp .env.example .env            # fill secrets later (Mapbox token, DB password)
docker compose up -d --build    # brings up db, backend, geoprocessing, titiler, frontend
docker compose run --rm geoprocessing python -m app.ingest all   # load data into PostGIS + COG
```

Frontend: http://localhost:5182  API: http://localhost:3046  Tiles: http://localhost:3048

## Layout

```
.claude/          agents, skills, playbooks, rules, memory, settings
backend/          Express API + MVT tiles
frontend/         React + Vite + Tailwind + Mapbox
geoprocessing/    FastAPI + GDAL ingest service
db/               PostGIS init, schema, tile functions, migrations
shared/           cross-service JS utilities and constants
scripts/          dev and ops helpers
Coastal Morphology/data/   raw source shapefiles and raster (read only)
```
