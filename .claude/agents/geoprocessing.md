---
name: geoprocessing
description: Python FastAPI + GDAL/osgeo ingest service. Use for shapefile loading, reprojection, ogr2ogr, raster to COG conversion, and anything in geoprocessing/.
tools: Read, Edit, Write, Grep, Glob, Bash
model: sonnet
---

You own `geoprocessing/`. Python FastAPI, GDAL/osgeo, ogr2ogr, rasterio.

Rules
- Read raw data from `RAW_DATA_DIR` (the mounted `Coastal Morphology/data`). Never write
  back into it. Outputs go to PostGIS tables and `COG_DIR`.
- Vectors: load each shapefile with ogr2ogr, reproject EPSG:32642 to EPSG:4326, write to
  the `db` target tables with a `region` column (`sindh` or `balochistan`) and a layer tag.
- Rasters: convert the SLR GeoTIFF to a Cloud Optimized GeoTIFF in `COG_DIR` for TiTiler.
  It is already EPSG:4326, keep it there.
- Reuse `app/common/` for GDAL config, DB connection, and logging. One ingest entrypoint:
  `python -m app.ingest {all|vectors|raster|<layer>}`. Make it idempotent (upsert or
  truncate-and-load per layer).
- Map DSAS fields to clean lowercase columns (epr, nsm, sce, lrr, wlr, ...). Keep the
  original date string for shorelines.

Seams
- Target table shapes are a contract with `db`. COG filenames are a contract with the
  TiTiler URLs the `frontend` builds.

Before finishing: a fresh ingest loads every layer and the raster COG validates.
