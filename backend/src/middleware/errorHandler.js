// Central error handler. Returns { error: { code, message } } with a correct status.
// Logs the full stack server side with the request id. Never leaks stacks to clients.
import { isProd } from "../config.js";
import { ApiError } from "../utils/respond.js";
import { logger } from "../utils/logger.js";

export function notFoundHandler(req, res) {
  res.status(404).json({ error: { code: "not_found", message: "route not found" } });
}

// Express error middleware must keep all four args.
export function errorHandler(err, req, res, next) {
  const status = err instanceof ApiError ? err.status : 500;
  const code = err instanceof ApiError ? err.code : "internal_error";

  logger.error("request_error", { id: req.id, code, status, message: err.message, stack: err.stack });

  const message = status === 500 && isProd ? "internal error" : err.message;
  res.status(status).json({ error: { code, message } });
}
