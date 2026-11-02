---
name: project-overview
description: What the coastal morphology portal is, its stack, and its scope
metadata:
  type: project
---

A self-contained PERN + FastAPI portal for shoreline change analysis and sea level rise
on the Pakistan coast (Sindh and Balochistan). It visualizes USGS DSAS output (historical
shorelines, baselines, transects with change rates, 10 year forecasts) and an SLR raster
on a Mapbox map with dark and light themes.

Five agents own the stack: [[fixed-infrastructure]] lists their ports. Vectors are tiled
with ST_AsMVT from PostGIS, the raster is tiled by TiTiler. See [[data-facts]].
