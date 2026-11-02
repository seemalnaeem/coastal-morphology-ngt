"""Load vector layers from shapefiles into PostGIS, reprojected to 4326."""
import os

from ..common import db
from ..common.config import RAW_DATA_DIR
from ..common.gdal import ogr2ogr_to_pg, run, pg_ogr_dsn
from ..common.logging import get_logger
from .registry import VECTORS

log = get_logger("vectors")


def _entries(layer: str | None = None, region: str | None = None):
    for e in VECTORS:
        if layer and e["layer"] != layer:
            continue
        if region and e["region"] != region:
            continue
        yield e


def load(layer: str | None = None, region: str | None = None) -> dict:
    """Idempotent load. Clears the (table, region) subset first, then appends."""
    loaded = {}
    for e in _entries(layer, region):
        path = os.path.join(RAW_DATA_DIR, e["file"])
        if not os.path.exists(path):
            log.warning("missing source, skipping: %s", path)
            continue

        # clear just this region for this table so re-ingest is clean
        db.execute(f"DELETE FROM {e['table']} WHERE region = %s", (e["region"],))

        sql = f"SELECT {e['cols']}, '{e['region']}' AS region FROM \"{e['src']}\""
        ogr2ogr_to_pg(path, e["table"], sql, e["geom"])

        n = db.count(e["table"], e["region"])
        key = f"{e['layer']}:{e['region']}"
        loaded[key] = n
        log.info("loaded %s -> %s rows", key, n)
    return loaded


def load_slr_2050() -> dict:
    """Load the 2050 sea level rise inundation footprint from ssl2050.kml.

    The KML is a single multi geometry, exploded into many polygons for efficient tiling.
    It is already EPSG:4326.
    """
    path = os.path.join(RAW_DATA_DIR, "SLR", "ssl2050.kml")
    if not os.path.exists(path):
        log.warning("missing slr 2050 kml, skipping: %s", path)
        return {}

    db.execute("DELETE FROM slr_2050")
    run([
        "ogr2ogr",
        "-f", "PostgreSQL",
        pg_ogr_dsn(),
        path,
        "-t_srs", "EPSG:4326",
        "-nln", "slr_2050",
        "-nlt", "PROMOTE_TO_MULTI",
        "-explodecollections",   # split the one multi geometry into many polygons
        "-append",
        "-skipfailures",
    ])
    n = db.count("slr_2050")
    log.info("loaded slr_2050 -> %s rows", n)
    return {"slr_2050": n}
