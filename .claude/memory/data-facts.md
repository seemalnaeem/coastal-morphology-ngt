---
name: data-facts
description: DSAS fields, regions, sign convention, and raster quirks for the source data
metadata:
  type: reference
---

Source data is in `Coastal Morphology/data/{Balochistan,Sindh,SLR}` and is USGS DSAS output.

- Regions: `sindh`, `balochistan`. Balochistan filenames carry a `_balochistan` suffix,
  Sindh naming is less consistent (`transects-sindh`, `10yrs_Forecast_Line`).
- Transects hold DSAS stats: epr, nsm, sce, lrr, lr2, lse, lci95, wlr, wr2, wse, wci95,
  azimuth. Sindh has 1202 transects, Balochistan 728.
- Sign convention: negative is erosion, positive is accretion. Transects symbolized on WLR
  with a red to blue diverging ramp. Breaks live in [[fixed-infrastructure]] and the data
  contract.
- Shoreline `DATE_` is a free text string (50 chars), keep it as text.
- SLR raster is a single band, EPSG:4326, values clustered near 0.1 (very narrow range,
  stretch the color ramp to min/max or it looks flat). Original style is a spectral ramp.
- Depth to water table (DTW) rasters in `data/Depth to watertable/DTW(m)_2020.tif` and
  `_2030.tif`, EPSG:4326, meters. 2020 mean ~1.6 m, 2030 mean ~2.5 m (deeper by 2030).
  Served as COGs dtw_2020.tif and dtw_2030.tif, colormap rdylbu_r, rescale 1 to 5. Shown
  on the frontend as one layer `dtw` that auto cycles 2020 vs 2030 with a year toggle and
  a shallow to deep legend.
