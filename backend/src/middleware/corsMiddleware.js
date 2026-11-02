// CORS locked to the configured frontend origin.
import cors from "cors";
import { config } from "../config.js";

export const corsMiddleware = cors({
  origin: config.corsOrigin,
  methods: ["GET", "POST"],
});
