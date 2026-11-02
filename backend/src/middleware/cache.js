// Cache-Control helper for tile responses. Seconds come from config.
import { config } from "../config.js";

export function tileCache(req, res, next) {
  res.set("Cache-Control", `public, max-age=${config.tileCacheSeconds}`);
  next();
}
