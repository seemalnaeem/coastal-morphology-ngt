// Small validators used by routes. They throw ApiError on bad input.
import { REGIONS, VECTOR_LAYER_IDS } from "../shared.js";
import { badRequest } from "./respond.js";

const REGION_IDS = REGIONS.map((r) => r.id);

export function parseInteger(value, name) {
  const n = Number(value);
  if (!Number.isInteger(n)) throw badRequest(`${name} must be an integer`);
  return n;
}

// z/x/y bounds check for a slippy map tile.
export function parseTileCoords(z, x, y) {
  const zi = parseInteger(z, "z");
  const xi = parseInteger(x, "x");
  const yi = parseInteger(y, "y");
  if (zi < 0 || zi > 24) throw badRequest("z out of range");
  const max = 2 ** zi;
  if (xi < 0 || xi >= max || yi < 0 || yi >= max) throw badRequest("x or y out of range");
  return { z: zi, x: xi, y: yi };
}

// Whitelist the tile layer name. Never concat it into SQL without this.
export function parseLayer(layer) {
  if (!VECTOR_LAYER_IDS.includes(layer)) throw badRequest(`unknown layer: ${layer}`);
  return layer;
}

// Optional region filter.
export function parseRegion(region) {
  if (region === undefined || region === null || region === "") return null;
  if (!REGION_IDS.includes(region)) throw badRequest(`unknown region: ${region}`);
  return region;
}
