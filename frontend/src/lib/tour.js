// Guided story tour. The camera flies to each stop, tilts, spins, and pulses while a
// narration card reads out the shoreline trend from the live stats. Karachi first (the
// change layers), then Gwadar (every layer on).
import { VECTOR_LAYERS, RASTER_LAYERS, OVERLAY_LAYERS } from "@shared/index.js";

export const TOUR_STOPS = [
  {
    id: "karachi",
    title: "Karachi, Sindh",
    region: "sindh",
    center: [66.99, 24.86],
    zoom: 10.2,
    pitch: 45,
    layers: ["shoreline", "transect"],
    spinDegrees: 320,
    spinMs: 9000,
    // Show the coastal erosion write-up while the transects are on, before the raster.
    showTrendInfo: true,
    // After the trend layers, frame the full raster extent from above and reveal the sea
    // level rise layer by fading it in from low to high.
    slrReveal: { durationMs: 5000 },
    // Then compare depth to water table across 2020 and 2030, auto cycling the years.
    dtwCompare: { durationMs: 9000 },
    // Finally the 2050 flood footprint in 3D: show the whole extent first, zoom in to the
    // shore so buildings are visible, then sweep from the shore inland until the layer ends.
    build3d: {
      zoomInMs: 3500,
      // Sweep only from the shore to about the middle of the flood extent, then the tour
      // moves on to Gwadar.
      path: [
        { center: [66.98, 24.84], zoom: 15.6, pitch: 62, bearing: 24, duration: 3500 }, // shore
        { center: [67.18, 24.66], zoom: 14.6, pitch: 62, bearing: 40, duration: 6500 }, // mid (stop here)
      ],
      holdMs: 1500,
    },
  },
  {
    id: "gwadar",
    title: "Gwadar, Balochistan",
    region: "balochistan",
    center: [62.33, 25.12],
    zoom: 11,
    pitch: 55,
    layers: ["shoreline", "baseline", "transect", "forecast_line", "forecast_uncertainty", "slr_impact"],
    spinDegrees: 360,
    spinMs: 11000,
    // After the spin, settle flat and still so the sea level rise raster and its panel
    // can be read without the camera moving.
    holdForRaster: true,
  },
];

const ALL_LAYER_IDS = [...VECTOR_LAYERS, ...RASTER_LAYERS, ...OVERLAY_LAYERS].map((l) => l.id);

// Build the full active-layer map with only the given ids turned on.
export function layersActive(ids) {
  const active = {};
  ALL_LAYER_IDS.forEach((id) => (active[id] = ids.includes(id)));
  return active;
}

// A short plain sentence describing the trend at a stop, from a region_stats row.
export function trendSentence(title, row) {
  if (!row) return `${title}: reading the shoreline trend...`;
  const eroding = (row.pctEroding ?? 0) >= (row.pctAccreting ?? 0);
  const verb = eroding ? "retreating" : "advancing";
  const rate = row.meanEpr == null ? "-" : `${row.meanEpr > 0 ? "+" : ""}${Number(row.meanEpr).toFixed(2)}`;
  return `${title} is mostly ${verb}. Mean change ${rate} m/yr, ${Math.round(row.pctEroding ?? 0)}% of transects eroding.`;
}

export function waitFor(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Fly the camera and resolve once the move settles.
export function flyToAsync(map, opts) {
  return new Promise((resolve) => {
    const onEnd = () => {
      map.off("moveend", onEnd);
      resolve();
    };
    map.on("moveend", onEnd);
    map.flyTo({ essential: true, ...opts });
  });
}

// Ease the camera (no zoom arc) and resolve once settled. Good for a top-down tilt.
export function easeToAsync(map, opts) {
  return new Promise((resolve) => {
    const onEnd = () => {
      map.off("moveend", onEnd);
      resolve();
    };
    map.on("moveend", onEnd);
    map.easeTo({ essential: true, ...opts });
  });
}

// Frame a bounding box so the whole layer fits in view, resolving once settled.
export function fitBoundsAsync(map, bounds, opts) {
  return new Promise((resolve) => {
    const onEnd = () => {
      map.off("moveend", onEnd);
      resolve();
    };
    map.on("moveend", onEnd);
    map.fitBounds(bounds, { essential: true, ...opts });
  });
}

// Tween a numeric value over time, calling onStep each frame. Cancellable via token.
export function animateValue(from, to, ms, onStep, token) {
  return new Promise((resolve) => {
    let startTs = null;
    function frame(ts) {
      if (token?.cancelled) return resolve();
      if (startTs === null) startTs = ts;
      const t = Math.min(1, (ts - startTs) / ms);
      onStep(from + (to - from) * t);
      if (t < 1) requestAnimationFrame(frame);
      else resolve();
    }
    requestAnimationFrame(frame);
  });
}

// Smoothly rotate the bearing for a dramatic spin. Cancellable through token.cancelled.
export function spin(map, degrees, ms, token) {
  return new Promise((resolve) => {
    const start = map.getBearing();
    let startTs = null;
    function frame(ts) {
      if (token?.cancelled) return resolve();
      if (startTs === null) startTs = ts;
      const t = Math.min(1, (ts - startTs) / ms);
      map.setBearing(start + degrees * t);
      if (t < 1) requestAnimationFrame(frame);
      else resolve();
    }
    requestAnimationFrame(frame);
  });
}
