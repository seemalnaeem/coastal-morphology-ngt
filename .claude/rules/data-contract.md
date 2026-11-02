# Data contract

The shared vocabulary across db, geoprocessing, backend, and frontend. Keep all four in sync.

## Regions
`sindh`, `balochistan`. Every spatial row carries a `region` column.

## Layers (tile layer name -> table)
| layer                 | table                  | geom    | key attributes                         |
| --------------------- | ---------------------- | ------- | -------------------------------------- |
| shoreline             | shoreline              | line    | survey_date (text), uncertainty        |
| baseline              | baseline               | line    | group_id                               |
| transect              | transect               | line    | transect_id, epr, nsm, sce, lrr, wlr   |
| forecast_line         | forecast_line          | line    | forecast_period, forecast_year         |
| forecast_uncertainty  | forecast_uncertainty   | polygon | forecast_period, forecast_year         |
| slr_2050              | slr_2050               | polygon | (2050 flood extent, from ssl2050.kml)  |

Rasters served by TiTiler from `COG_DIR` (colormap + rescale set by the frontend):
`slr_impact.tif` (spectral), `dtw_2020.tif` and `dtw_2030.tif` (rdylbu_r, rescale 1 to 5,
shown as one animated 2020 vs 2030 comparison layer `dtw`).

Frontend only overlay (no backend tile): `buildings3d`, extruded from the Mapbox basemap
composite `building` source, for the 3D Karachi shoreline view.

## DSAS fields (lowercased from the shapefiles)
epr (end point rate), nsm (net shoreline movement), sce (shoreline change envelope),
lrr (linear regression rate), lr2, lse, lci95 (`LCI95_5`), wlr (weighted linear rate),
wr2, wse, wci95 (`WCI95_5`), azimuth, shr_count (`ShrCount`), trans_order (`TransOrder`).

Sign: negative = erosion, positive = accretion. Units are meters or meters/year.

## Classification breaks (rate m/yr, erosion -> accretion)
Diverging red to blue, mirror in `shared/constants` and the frontend legend:
`[-3, -2, -1, -0.5, 0.5, 1, 2, 3]` with colors
`#ca0020 #df5351 #f4a582 #f6cebd #ffffff #cfe0ee #9fc3dd #5b9ec9 #0571b0`.
