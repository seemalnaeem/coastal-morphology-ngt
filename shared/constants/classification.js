// Shoreline change classification. Backend and frontend both read this so the map,
// the legend, and any server side styling agree on one source of truth.
//
// Rate is meters per year. Negative is erosion, positive is accretion. The ramp is a
// red to blue diverging scale (red erodes, blue accretes), matching the source styling.

export const RATE_BREAKS = [-3, -2, -1, -0.5, 0.5, 1, 2, 3];

export const RATE_COLORS = [
  "#ca0020", // < -3   strong erosion
  "#df5351", // -3 .. -2
  "#f4a582", // -2 .. -1
  "#f6cebd", // -1 .. -0.5
  "#f7f7f7", // -0.5 .. 0.5  stable
  "#cfe0ee", // 0.5 .. 1
  "#9fc3dd", // 1 .. 2
  "#5b9ec9", // 2 .. 3
  "#0571b0", // > 3    strong accretion
];

export const RATE_LABELS = [
  "Strong erosion (< -3)",
  "-3 to -2",
  "-2 to -1",
  "-1 to -0.5",
  "Stable (-0.5 to 0.5)",
  "0.5 to 1",
  "1 to 2",
  "2 to 3",
  "Strong accretion (> 3)",
];

// Sequential spectral ramp for the sea level rise raster, passed to TiTiler as a colormap.
export const SLR_RAMP = [
  "#2b83ba", "#6db1af", "#aedea5", "#daf0b3", "#fff9b8",
  "#fecf87", "#f89c59", "#e65538", "#d7191c",
];

// Depth to water table ramp, shallow (blue) to deep (red), matching TiTiler rdylbu_r.
// Range is meters, used for the legend under the 2020 vs 2030 comparison.
export const DTW_RAMP = ["#2c7bb6", "#abd9e9", "#ffffbf", "#fdae61", "#d7191c"];
export const DTW_RANGE = [1, 5]; // meters, shallow to deep

// Build a Mapbox GL "step" expression for a numeric property against the breaks above.
export function rateStepExpression(property) {
  const expr = ["step", ["get", property], RATE_COLORS[0]];
  RATE_BREAKS.forEach((brk, i) => expr.push(brk, RATE_COLORS[i + 1]));
  return expr;
}
