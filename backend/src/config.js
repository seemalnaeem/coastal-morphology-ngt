// Backend configuration, read once from the environment.
export const config = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3046),
  databaseUrl: process.env.DATABASE_URL,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5182",
  tileCacheSeconds: Number(process.env.TILE_CACHE_SECONDS || 300),
};

export const isProd = config.env === "production";
