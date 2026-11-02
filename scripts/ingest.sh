#!/bin/bash
# Load the source data into PostGIS and build the raster COG.
# Usage: scripts/ingest.sh [all|vectors|raster|<layer>] [region]
set -e
target="${1:-all}"
region="${2:-}"
docker compose run --rm geoprocessing python -m app.ingest "$target" $region
