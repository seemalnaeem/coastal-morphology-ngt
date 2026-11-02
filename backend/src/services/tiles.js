// Vector tiles come straight from PostGIS via the mvt_tile function.
import { query } from "../db/pool.js";

// Returns a Buffer of protobuf bytes, or null for an empty tile.
export async function getTile(layer, z, x, y, region) {
  const { rows } = await query("SELECT mvt_tile($1, $2, $3, $4, $5) AS tile", [
    layer,
    z,
    x,
    y,
    region,
  ]);
  const tile = rows[0]?.tile;
  if (!tile || tile.length === 0) return null;
  return Buffer.from(tile);
}
