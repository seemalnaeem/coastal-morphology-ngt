// GET /tiles/:layer/:z/:x/:y.pbf  vector tiles via ST_AsMVT.
import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { tileCache } from "../middleware/cache.js";
import { getTile } from "../services/tiles.js";
import { parseLayer, parseRegion, parseTileCoords } from "../utils/validate.js";

export const tilesRouter = Router();

tilesRouter.get(
  "/:layer/:z/:x/:y.pbf",
  tileCache,
  asyncHandler(async (req, res) => {
    const layer = parseLayer(req.params.layer);
    const { z, x, y } = parseTileCoords(req.params.z, req.params.x, req.params.y);
    const region = parseRegion(req.query.region);

    const tile = await getTile(layer, z, x, y, region);
    res.set("Content-Type", "application/x-protobuf");
    if (!tile) return res.status(204).end();
    res.send(tile);
  })
);
