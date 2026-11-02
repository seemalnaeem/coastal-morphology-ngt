// One fetch wrapper for the whole app. Do not call fetch directly in components.
import { API_URL } from "./config.js";

async function getJson(path) {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message || `request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  layers: () => getJson("/api/layers"),
  stats: (region) => getJson(`/api/stats${region ? `?region=${region}` : ""}`),
  health: () => getJson("/api/health"),
};

// Build the MVT tile url template for a vector layer, with an optional region filter.
export function tileUrl(layer, region) {
  const q = region ? `?region=${region}` : "";
  return `${API_URL}/tiles/${layer}/{z}/{x}/{y}.pbf${q}`;
}
