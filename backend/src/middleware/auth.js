// Auth stub. A no-op until real requirements arrive, kept here so routes can opt in
// now and nothing changes later except this file.
export function requireAuth(req, res, next) {
  // When auth is wired, validate a token here and attach req.user, or 401.
  next();
}
