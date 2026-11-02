---
name: ingest-geodata
description: Load a shapefile or raster from Coastal Morphology/data into PostGIS or a COG. Use when adding or refreshing a layer, a region, or the SLR raster.
---

# Ingest geodata

Goal: raw file in `RAW_DATA_DIR` becomes a reprojected PostGIS table row set (vectors)
or a COG in `COG_DIR` (raster).

## Vectors
1. Confirm the target table and columns in `.claude/rules/data-contract.md`.
2. Add or reuse a loader in `geoprocessing/app/loaders/`. It should:
   - ogr2ogr the shapefile to the table, `-s_srs EPSG:32642 -t_srs EPSG:4326`,
     `-nlt PROMOTE_TO_MULTI`, `-lco GEOMETRY_NAME=geom`.
   - inject the `region` column and map DSAS fields to the lowercase names.
   - be idempotent: delete that `(layer, region)` subset first, then append.
3. Run `python -m app.ingest <layer>` (or `vectors`). Verify row count and `ST_SRID`.

## Raster
1. `rio cogeo create` (rasterio) or `gdal_translate ... -of COG` into `COG_DIR`.
2. Keep EPSG:4326. Name it to match the TiTiler URL the frontend builds (`slr_impact.tif`).
3. Validate with `rio cogeo validate`.

Done when: `mvt_tile` returns bytes for the layer, or TiTiler serves the COG.
