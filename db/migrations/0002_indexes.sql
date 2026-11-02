-- 0002 spatial and attribute indexes. Idempotent.

CREATE INDEX IF NOT EXISTS shoreline_geom_gix            ON shoreline            USING gist (geom);
CREATE INDEX IF NOT EXISTS baseline_geom_gix             ON baseline             USING gist (geom);
CREATE INDEX IF NOT EXISTS transect_geom_gix             ON transect             USING gist (geom);
CREATE INDEX IF NOT EXISTS forecast_line_geom_gix        ON forecast_line        USING gist (geom);
CREATE INDEX IF NOT EXISTS forecast_uncertainty_geom_gix ON forecast_uncertainty USING gist (geom);

CREATE INDEX IF NOT EXISTS shoreline_region_idx            ON shoreline            (region);
CREATE INDEX IF NOT EXISTS baseline_region_idx             ON baseline             (region);
CREATE INDEX IF NOT EXISTS transect_region_idx             ON transect             (region);
CREATE INDEX IF NOT EXISTS forecast_line_region_idx        ON forecast_line        (region);
CREATE INDEX IF NOT EXISTS forecast_uncertainty_region_idx ON forecast_uncertainty (region);

-- Transects are filtered and symbolized on change rates.
CREATE INDEX IF NOT EXISTS transect_wlr_idx ON transect (wlr);
CREATE INDEX IF NOT EXISTS transect_epr_idx ON transect (epr);
CREATE INDEX IF NOT EXISTS transect_nsm_idx ON transect (nsm);
