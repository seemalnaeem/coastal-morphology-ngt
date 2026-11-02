-- 0005 sea level rise 2050 inundation footprint, loaded from ssl2050.kml.
-- One flood feature exploded into many polygons for efficient tiling. No region split.

CREATE TABLE IF NOT EXISTS slr_2050 (
  id   bigserial PRIMARY KEY,
  geom geometry(MultiPolygon, 4326) NOT NULL
);

CREATE INDEX IF NOT EXISTS slr_2050_geom_gix ON slr_2050 USING gist (geom);
