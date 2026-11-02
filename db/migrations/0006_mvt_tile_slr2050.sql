-- 0006 extend mvt_tile with the slr_2050 flood layer. Full redefine so the function stays
-- a single source of truth. A polygon layer with no region filter.

CREATE OR REPLACE FUNCTION mvt_tile(
  p_layer  text,
  p_z      integer,
  p_x      integer,
  p_y      integer,
  p_region text DEFAULT NULL
) RETURNS bytea
LANGUAGE plpgsql STABLE PARALLEL SAFE AS $$
DECLARE
  env3857 geometry := ST_TileEnvelope(p_z, p_x, p_y);
  env4326 geometry := ST_Transform(env3857, 4326);
  result  bytea;
BEGIN
  IF p_layer = 'transect' THEN
    SELECT ST_AsMVT(t, 'transect', 4096, 'geom') INTO result FROM (
      SELECT transect_id, region::text AS region, epr, nsm, sce, lrr, wlr,
             ST_AsMVTGeom(ST_Transform(geom, 3857), env3857, 4096, 64, true) AS geom
      FROM transect
      WHERE geom && env4326 AND (p_region IS NULL OR region::text = p_region)
    ) t;

  ELSIF p_layer = 'shoreline' THEN
    SELECT ST_AsMVT(t, 'shoreline', 4096, 'geom') INTO result FROM (
      SELECT id, region::text AS region, survey_date, uncertainty,
             ST_AsMVTGeom(ST_Transform(geom, 3857), env3857, 4096, 64, true) AS geom
      FROM shoreline
      WHERE geom && env4326 AND (p_region IS NULL OR region::text = p_region)
    ) t;

  ELSIF p_layer = 'baseline' THEN
    SELECT ST_AsMVT(t, 'baseline', 4096, 'geom') INTO result FROM (
      SELECT id, region::text AS region, group_id,
             ST_AsMVTGeom(ST_Transform(geom, 3857), env3857, 4096, 64, true) AS geom
      FROM baseline
      WHERE geom && env4326 AND (p_region IS NULL OR region::text = p_region)
    ) t;

  ELSIF p_layer = 'forecast_line' THEN
    SELECT ST_AsMVT(t, 'forecast_line', 4096, 'geom') INTO result FROM (
      SELECT id, region::text AS region, forecast_period, forecast_year,
             ST_AsMVTGeom(ST_Transform(geom, 3857), env3857, 4096, 64, true) AS geom
      FROM forecast_line
      WHERE geom && env4326 AND (p_region IS NULL OR region::text = p_region)
    ) t;

  ELSIF p_layer = 'forecast_uncertainty' THEN
    SELECT ST_AsMVT(t, 'forecast_uncertainty', 4096, 'geom') INTO result FROM (
      SELECT id, region::text AS region, forecast_period, forecast_year,
             ST_AsMVTGeom(ST_Transform(geom, 3857), env3857, 4096, 64, true) AS geom
      FROM forecast_uncertainty
      WHERE geom && env4326 AND (p_region IS NULL OR region::text = p_region)
    ) t;

  ELSIF p_layer = 'slr_2050' THEN
    SELECT ST_AsMVT(t, 'slr_2050', 4096, 'geom') INTO result FROM (
      SELECT id,
             ST_AsMVTGeom(ST_Transform(geom, 3857), env3857, 4096, 64, true) AS geom
      FROM slr_2050
      WHERE geom && env4326
    ) t;

  ELSE
    RAISE EXCEPTION 'unknown tile layer: %', p_layer;
  END IF;

  RETURN result;
END;
$$;
