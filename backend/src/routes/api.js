// REST API under /api. Layer catalog and dashboard stats.
import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { getRegionStats } from "../services/stats.js";
import { parseRegion } from "../utils/validate.js";
import {
  RASTER_LAYERS,
  REGIONS,
  VECTOR_LAYERS,
  RATE_BREAKS,
  RATE_COLORS,
  RATE_LABELS,
  SLR_RAMP,
} from "../shared.js";

export const apiRouter = Router();

// Catalog the frontend uses to build the layer control and legend.
apiRouter.get("/layers", (req, res) => {
  res.json({
    regions: REGIONS,
    vectorLayers: VECTOR_LAYERS,
    rasterLayers: RASTER_LAYERS,
    classification: { breaks: RATE_BREAKS, colors: RATE_COLORS, labels: RATE_LABELS, slrRamp: SLR_RAMP },
  });
});

// Summary stats, optionally filtered to one region.
apiRouter.get(
  "/stats",
  asyncHandler(async (req, res) => {
    const region = parseRegion(req.query.region);
    res.json({ stats: await getRegionStats(region) });
  })
);
