"""Shared configuration, read once from the environment."""
import os

DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql://coastal:change-me-strong@db:5432/coastal_morphology_NGT")
RAW_DATA_DIR = os.environ.get("RAW_DATA_DIR", "/data/raw")
COG_DIR = os.environ.get("COG_DIR", "/data/cog")
PORT = int(os.environ.get("PORT", "3047"))

# Source projection of every shapefile, reprojected to this target on ingest.
SOURCE_SRID = 32642   # WGS84 UTM Zone 42N
TARGET_SRID = 4326    # WGS84 geographic, stored and served

VALID_REGIONS = ("sindh", "balochistan")
