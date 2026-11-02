"""Maps each (layer, region) to its source shapefile and column projection.

`cols` is the OGR SQL select list that renames the DSAS fields to the clean lowercase
target columns. The region literal and FROM clause are added by the vector loader. Field
names match what OGR reads from the shapefiles (DBF names, already 10 char truncated).
"""

# geometry target type per layer (all promoted to multi on load)
LINE = "PROMOTE_TO_MULTI"
POLY = "PROMOTE_TO_MULTI"

VECTORS = [
    # --- Balochistan ---
    {
        "layer": "shoreline", "region": "balochistan", "table": "shoreline", "geom": LINE,
        "file": "Balochistan/shoreline_balochistan.shp", "src": "shoreline_balochistan",
        "cols": '"DATE_" AS survey_date, UNCERTAINI AS uncertainty',
    },
    {
        "layer": "baseline", "region": "balochistan", "table": "baseline", "geom": LINE,
        "file": "Balochistan/Baseline_balochistan.shp", "src": "Baseline_balochistan",
        "cols": 'GROUP_ AS group_id',
    },
    {
        "layer": "transect", "region": "balochistan", "table": "transect", "geom": LINE,
        "file": "Balochistan/transects_balochistan.shp", "src": "transects_balochistan",
        "cols": (
            "TransectID AS transect_id, BaselineID AS baseline_id, GroupID AS group_id, "
            "TransOrder AS trans_order, Azimuth AS azimuth, ShrCount AS shr_count, "
            "SCE AS sce, NSM AS nsm, EPR AS epr, EPRunc AS epr_unc, "
            "LRR AS lrr, LR2 AS lr2, LSE AS lse, LCI95_5 AS lci95, "
            "WLR AS wlr, WR2 AS wr2, WSE AS wse, WCI95_5 AS wci95"
        ),
    },
    {
        "layer": "forecast_line", "region": "balochistan", "table": "forecast_line", "geom": LINE,
        "file": "Balochistan/Forecast_line_balochistan.shp", "src": "Forecast_line_balochistan",
        "cols": 'ForecastPe AS forecast_period, ForecastYe AS forecast_year',
    },
    {
        "layer": "forecast_uncertainty", "region": "balochistan", "table": "forecast_uncertainty", "geom": POLY,
        "file": "Balochistan/10yrs_Forecast_Uncertainity_Area_balochistan.shp",
        "src": "10yrs_Forecast_Uncertainity_Area_balochistan",
        "cols": 'ForecastPe AS forecast_period, ForecastYe AS forecast_year',
    },
    # --- Sindh ---
    {
        "layer": "shoreline", "region": "sindh", "table": "shoreline", "geom": LINE,
        "file": "Sindh/shoreline_sindh.shp", "src": "shoreline_sindh",
        "cols": '"DATE_" AS survey_date, UNCERTAINI AS uncertainty',
    },
    {
        "layer": "baseline", "region": "sindh", "table": "baseline", "geom": LINE,
        "file": "Sindh/Baseline_sindh.shp", "src": "Baseline_sindh",
        "cols": 'GROUP_ AS group_id',
    },
    {
        "layer": "transect", "region": "sindh", "table": "transect", "geom": LINE,
        "file": "Sindh/transects-sindh.shp", "src": "transects-sindh",
        "cols": (
            "TransectID AS transect_id, BaselineID AS baseline_id, GroupID AS group_id, "
            "TransOrder AS trans_order, Azimuth AS azimuth, ShrCount AS shr_count, "
            "SCE AS sce, NSM AS nsm, EPR AS epr, EPRunc AS epr_unc, "
            "LRR AS lrr, LR2 AS lr2, LSE AS lse, LCI95_5 AS lci95, "
            "WLR AS wlr, WR2 AS wr2, WSE AS wse, WCI95_5 AS wci95"
        ),
    },
    {
        "layer": "forecast_line", "region": "sindh", "table": "forecast_line", "geom": LINE,
        "file": "Sindh/10yrs_Forecast_Line.shp", "src": "10yrs_Forecast_Line",
        "cols": 'ForecastPe AS forecast_period, ForecastYe AS forecast_year',
    },
    {
        "layer": "forecast_uncertainty", "region": "sindh", "table": "forecast_uncertainty", "geom": POLY,
        "file": "Sindh/10yrs_Forecast_Uncertainity_Area.shp", "src": "10yrs_Forecast_Uncertainity_Area",
        "cols": 'ForecastPe AS forecast_period, ForecastYe AS forecast_year',
    },
]

# Raster: source GeoTIFF -> COG name the TiTiler urls expect.
RASTERS = [
    {"name": "slr_impact", "file": "SLR/Sea Level Rise Impact.tif", "out": "slr_impact.tif"},
    {"name": "dtw_2020", "file": "Depth to watertable/DTW(m)_2020.tif", "out": "dtw_2020.tif"},
    {"name": "dtw_2030", "file": "Depth to watertable/DTW(m)_2030.tif", "out": "dtw_2030.tif"},
]

VECTOR_LAYERS = sorted({v["layer"] for v in VECTORS})
