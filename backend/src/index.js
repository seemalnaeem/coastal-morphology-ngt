// Coastal Morphology backend. Express REST API plus vector tiles.
import express from "express";
import { config } from "./config.js";
import { corsMiddleware } from "./middleware/corsMiddleware.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { rateLimit } from "./middleware/rateLimit.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { healthRouter } from "./routes/health.js";
import { tilesRouter } from "./routes/tiles.js";
import { apiRouter } from "./routes/api.js";
import { logger } from "./utils/logger.js";

export function createApp() {
  const app = express();
  app.disable("x-powered-by");

  // cross cutting layers, owned by the middleware agent
  app.use(corsMiddleware);
  app.use(requestLogger);
  app.use(rateLimit);
  app.use(express.json());

  // routes
  app.use("/api", healthRouter);
  app.use("/api", apiRouter);
  app.use("/tiles", tilesRouter);

  // fallthrough and errors
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

// Start only when run directly, so tests can import createApp.
if (import.meta.url === `file://${process.argv[1]}`) {
  const app = createApp();
  app.listen(config.port, () => logger.info("backend listening", { port: config.port, env: config.env }));
}
