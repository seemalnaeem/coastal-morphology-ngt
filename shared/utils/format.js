// Formatting helpers shared by the API responses and the UI. One place, no duplicates.

// A signed rate like "-1.42 m/yr". Returns a dash for null or undefined.
export function formatRate(value, digits = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  const sign = value > 0 ? "+" : "";
  return `${sign}${Number(value).toFixed(digits)} m/yr`;
}

// A distance like "12.4 m".
export function formatMeters(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  return `${Number(value).toFixed(digits)} m`;
}

// A percent like "63.1%".
export function formatPercent(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  return `${Number(value).toFixed(digits)}%`;
}

// Plain English for the sign of a change rate.
export function trendLabel(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "unknown";
  if (value < -0.5) return "eroding";
  if (value > 0.5) return "accreting";
  return "stable";
}

// Title case a region id, for example "sindh" to "Sindh".
export function titleCase(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}
