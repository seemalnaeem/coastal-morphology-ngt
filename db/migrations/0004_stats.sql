-- 0004 summary stats for the dashboard panels. Reads from transect.

CREATE OR REPLACE FUNCTION region_stats(p_region text DEFAULT NULL)
RETURNS TABLE (
  region         text,
  transects      bigint,
  mean_epr       double precision,
  mean_nsm       double precision,
  pct_eroding    double precision,
  pct_accreting  double precision,
  max_erosion    double precision,
  max_accretion  double precision
)
LANGUAGE sql STABLE AS $$
  SELECT
    region::text,
    count(*),
    avg(epr),
    avg(nsm),
    100.0 * count(*) FILTER (WHERE epr < 0) / nullif(count(*), 0),
    100.0 * count(*) FILTER (WHERE epr > 0) / nullif(count(*), 0),
    min(epr),
    max(epr)
  FROM transect
  WHERE (p_region IS NULL OR region::text = p_region)
  GROUP BY region;
$$;
