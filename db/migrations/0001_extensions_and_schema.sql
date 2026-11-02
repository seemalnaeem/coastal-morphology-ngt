-- 0001 extensions and spatial schema for the coastal morphology portal.
-- Idempotent. Geometry is stored in EPSG:4326 and transformed to 3857 at tile time.

CREATE EXTENSION IF NOT EXISTS postgis;

-- Region is plain text with a check so ogr2ogr can append the literal directly.
-- Valid values: 'sindh', 'balochistan'.

-- Historical shorelines with survey date and positional uncertainty.
CREATE TABLE IF NOT EXISTS shoreline (
  id          bigserial PRIMARY KEY,
  region      text NOT NULL CHECK (region IN ('sindh', 'balochistan')),
  survey_date text,
  uncertainty double precision,
  geom        geometry(MultiLineString, 4326) NOT NULL
);

-- Reference baselines transects are cast from.
CREATE TABLE IF NOT EXISTS baseline (
  id       bigserial PRIMARY KEY,
  region   text NOT NULL CHECK (region IN ('sindh', 'balochistan')),
  group_id integer,
  geom     geometry(MultiLineString, 4326) NOT NULL
);

-- DSAS transects with shoreline change statistics.
CREATE TABLE IF NOT EXISTS transect (
  id          bigserial PRIMARY KEY,
  region      text NOT NULL CHECK (region IN ('sindh', 'balochistan')),
  transect_id integer,
  baseline_id integer,
  group_id    integer,
  trans_order integer,
  azimuth     double precision,
  shr_count   integer,
  sce         double precision,   -- shoreline change envelope (m)
  nsm         double precision,   -- net shoreline movement (m)
  epr         double precision,   -- end point rate (m/yr)
  epr_unc     double precision,
  lrr         double precision,   -- linear regression rate (m/yr)
  lr2         double precision,
  lse         double precision,
  lci95       double precision,
  wlr         double precision,   -- weighted linear regression rate (m/yr)
  wr2         double precision,
  wse         double precision,
  wci95       double precision,
  geom        geometry(MultiLineString, 4326) NOT NULL
);

-- 10 year forecast shoreline lines.
CREATE TABLE IF NOT EXISTS forecast_line (
  id              bigserial PRIMARY KEY,
  region          text NOT NULL CHECK (region IN ('sindh', 'balochistan')),
  forecast_period integer,
  forecast_year   double precision,
  geom            geometry(MultiLineString, 4326) NOT NULL
);

-- 10 year forecast uncertainty polygons.
CREATE TABLE IF NOT EXISTS forecast_uncertainty (
  id              bigserial PRIMARY KEY,
  region          text NOT NULL CHECK (region IN ('sindh', 'balochistan')),
  forecast_period integer,
  forecast_year   double precision,
  geom            geometry(MultiPolygon, 4326) NOT NULL
);
