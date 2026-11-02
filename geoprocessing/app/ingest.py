"""Ingest entrypoint.

Usage:
    python -m app.ingest all                 load every vector layer and build the raster COG
    python -m app.ingest vectors             load every vector layer
    python -m app.ingest raster              build the raster COG(s)
    python -m app.ingest <layer> [region]    load one vector layer, optionally one region
"""
import sys

from .common.logging import get_logger
from .loaders import raster, vectors
from .loaders.registry import VECTOR_LAYERS

log = get_logger("ingest")


def run(target: str = "all", region: str | None = None) -> dict:
    if target == "all":
        return {
            "vectors": {**vectors.load(), **vectors.load_slr_2050()},
            "raster": raster.build(),
        }
    if target == "vectors":
        return {"vectors": {**vectors.load(region=region), **vectors.load_slr_2050()}}
    if target == "raster":
        return {"raster": raster.build()}
    if target == "slr_2050":
        return {"vectors": vectors.load_slr_2050()}
    if target in VECTOR_LAYERS:
        return {"vectors": vectors.load(layer=target, region=region)}
    raise SystemExit(
        f"unknown target '{target}'. Use: all, vectors, raster, slr_2050, or one of {VECTOR_LAYERS}"
    )


if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "all"
    region = sys.argv[2] if len(sys.argv) > 2 else None
    result = run(target, region)
    log.info("ingest done: %s", result)
