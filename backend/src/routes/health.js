import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { healthy } from "../db/pool.js";

export const healthRouter = Router();

healthRouter.get(
  "/health",
  asyncHandler(async (req, res) => {
    const db = await healthy();
    res.status(db ? 200 : 503).json({ status: db ? "ok" : "degraded", db });
  })
);
