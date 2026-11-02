// Tiny in memory rate limiter. Enough to blunt abuse in dev, swap for Redis in prod.
const WINDOW_MS = 60_000;
const MAX = 1200; // requests per window per ip

const hits = new Map();

export function rateLimit(req, res, next) {
  // Vector tiles are high volume by design (a single map view fans out to many
  // tile requests across layers and zoom levels) and are already cache friendly,
  // so they are exempt from the abuse cap that protects the JSON API.
  if (req.path.startsWith("/tiles/")) return next();

  const now = Date.now();
  const ip = req.ip;
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return next();
  }
  entry.count += 1;
  if (entry.count > MAX) {
    res.set("Retry-After", String(Math.ceil((entry.reset - now) / 1000)));
    return res.status(429).json({ error: { code: "rate_limited", message: "too many requests" } });
  }
  next();
}
