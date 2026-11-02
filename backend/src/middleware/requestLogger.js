// Assigns a request id and logs one line per request on finish.
import { randomUUID } from "node:crypto";
import { logger } from "../utils/logger.js";

export function requestLogger(req, res, next) {
  req.id = randomUUID();
  const start = Date.now();
  res.on("finish", () => {
    logger.info("request", {
      id: req.id,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      ms: Date.now() - start,
    });
  });
  next();
}
