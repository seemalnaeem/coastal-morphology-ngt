"""GDAL/OGR helpers wrapping the command line tools that ship in the image."""
import subprocess

from .config import DATABASE_URL, TARGET_SRID
from .logging import get_logger

log = get_logger("gdal")


def pg_ogr_dsn() -> str:
    """ogr2ogr wants a libpq style DSN, which our postgresql:// URL already is."""
    return f"PG:{DATABASE_URL}"


def run(cmd: list[str]) -> None:
    log.info("run %s", " ".join(cmd))
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        log.error("command failed: %s", proc.stderr.strip())
        raise RuntimeError(proc.stderr.strip() or "command failed")
    if proc.stdout.strip():
        log.info(proc.stdout.strip())


def ogr2ogr_to_pg(shapefile: str, table: str, select_sql: str, geom_type: str = "PROMOTE_TO_MULTI") -> None:
    """Load one shapefile into a PostGIS table, reprojecting to the target SRID.

    select_sql is OGR SQL that aliases source fields to the target columns and injects
    the region literal, for example:
        SELECT OBJECTID AS transect_id, 'sindh' AS region FROM transects
    """
    run([
        "ogr2ogr",
        "-f", "PostgreSQL",
        _pg_ogr_dsn(),
        shapefile,
        # Read the real source CRS from each file's .prj and reproject to the target.
        # Most layers are UTM 42N (32642) but some (Sindh forecasts) are already 4326,
        # so we must not force a single source SRID or the geographic ones collapse.
        "-t_srs", f"EPSG:{TARGET_SRID}",
        "-nln", table,
        "-nlt", geom_type,
        "-lco", "GEOMETRY_NAME=geom",
        "-lco", "FID=id",
        "-append",
        # Some source records carry a null or empty geometry. Skip those rather than
        # abort the whole layer, since a feature with no geometry is not usable on a map.
        "-skipfailures",
        "-dialect", "OGRSQL",
        "-sql", select_sql,
    ])
