// Minimal structured logger. One per process, used by middleware and services.
function line(level, msg, meta) {
  const base = { ts: new Date().toISOString(), level, msg };
  const record = meta ? { ...base, ...meta } : base;
  const out = level === "error" ? console.error : console.log;
  out(JSON.stringify(record));
}

export const logger = {
  info: (msg, meta) => line("info", msg, meta),
  warn: (msg, meta) => line("warn", msg, meta),
  error: (msg, meta) => line("error", msg, meta),
};
