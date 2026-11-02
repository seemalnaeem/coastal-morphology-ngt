// One shared pg pool for the whole server. Always query through here.
import pg from "pg";
import { config } from "../config.js";

export const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  max: 10,
  idleTimeoutMillis: 30000,
});

// Parameterized query helper. Never build SQL by string concatenation of user input.
export function query(text, params) {
  return pool.query(text, params);
}

export async function healthy() {
  try {
    await pool.query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}
