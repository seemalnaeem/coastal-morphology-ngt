---
name: decisions
description: Architecture choices made for the portal and open questions
metadata:
  type: project
---

Decisions:
- Vector tiles via ST_AsMVT in the backend (not a separate tile server), raster via TiTiler.
  Matches the user's explicit request.
- Geoprocessing is a FastAPI service with GDAL/ogr2ogr so ingest can also run on demand
  over HTTP later, not just as a CLI.
- Geometry stored in 4326, transformed to 3857 at tile time inside `mvt_tile`.
- Frontend uses react-map-gl over raw mapbox-gl for a cleaner React surface. react-icons
  only, Lucide is banned. See [[fixed-infrastructure]].

Resolved:
- DB name is `coastal_morphology_NGT` (renamed from the `global-wildfire` placeholder
  at the user's request).

Open questions to confirm with the user:
- External data APIs were mentioned but not yet provided. Ingest is built to extend.
- Auth: a no-op `requireAuth` stub is in place until requirements arrive.
