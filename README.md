# Coastal Morphology Portal

A self-contained full-stack portal for shoreline change (USGS DSAS) and sea level rise on
the Pakistan coast (Sindh and Balochistan). PERN stack plus a Python FastAPI geoprocessing
service, all dockerized under the `coastal_morphology` namespace.

See [CLAUDE.md](CLAUDE.md) for the architecture and [.claude/](.claude) for the agents,
skills, playbooks, rules, and memory that drive development.

## Run it

```bash
cp .env.example .env            # set POSTGRES_PASSWORD, add VITE_MAPBOX_TOKEN later
docker compose up -d --build
docker compose run --rm geoprocessing python -m app.ingest all
```

- Frontend http://localhost:5182
- API http://localhost:3046
- Raster tiles (TiTiler) http://localhost:3048
- Database `coastal_morphology_NGT` on localhost:5442

## Services

| Service       | Stack                       | Port |
| ------------- | --------------------------- | ---- |
| db            | PostGIS 16                  | 5442 |
| backend       | Node + Express              | 3046 |
| geoprocessing | Python FastAPI + GDAL       | 3047 |
| titiler       | TiTiler                     | 3048 |
| frontend      | React + Vite + Tailwind     | 5182 |

Vectors are tiled with `ST_AsMVT` from the backend, the SLR raster is tiled by TiTiler.
Styling (color ramps, breaks) lives once in `shared/constants` and is used by both the
map and the API. No em-dashes, Tailwind for CSS, react-icons for icons.
