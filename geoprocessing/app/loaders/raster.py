"""Convert source GeoTIFFs to Cloud Optimized GeoTIFFs for TiTiler."""
import os

from rio_cogeo.cogeo import cog_translate
from rio_cogeo.profiles import cog_profiles

from ..common.config import COG_DIR, RAW_DATA_DIR
from ..common.logging import get_logger
from .registry import RASTERS

log = get_logger("raster")


def build(name: str | None = None) -> dict:
    """Write a COG per raster. Already EPSG:4326, so we keep the CRS as is."""
    os.makedirs(COG_DIR, exist_ok=True)
    built = {}
    profile = cog_profiles.get("deflate")
    for r in RASTERS:
        if name and r["name"] != name:
            continue
        src = os.path.join(RAW_DATA_DIR, r["file"])
        dst = os.path.join(COG_DIR, r["out"])
        if not os.path.exists(src):
            log.warning("missing raster, skipping: %s", src)
            continue
        log.info("cog %s -> %s", src, dst)
        cog_translate(src, dst, profile, overview_resampling="bilinear", quiet=True)
        built[r["name"]] = dst
    return built
