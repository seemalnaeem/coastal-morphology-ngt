// Paint definitions for each vector layer, built from the shared classification so the
// map and legend never drift. One place to tune symbology.
import { rateStepExpression } from "@shared/index.js";

export const MAPBOX_STYLE = {
  light: "mapbox://styles/mapbox/light-v11",
  dark: "mapbox://styles/mapbox/dark-v11",
};

// Returns the react-map-gl Layer props for a given vector layer id.
export function vectorLayerStyle(layerId, theme) {
  const neutralLine = theme === "dark" ? "#94a3b8" : "#475569";

  switch (layerId) {
    case "transect":
      return {
        type: "line",
        "source-layer": "transect",
        paint: { "line-color": rateStepExpression("wlr"), "line-width": 1.4 },
      };
    case "shoreline":
      return {
        type: "line",
        "source-layer": "shoreline",
        paint: { "line-color": theme === "dark" ? "#e2e8f0" : "#0f172a", "line-width": 1.2 },
      };
    case "baseline":
      return {
        type: "line",
        "source-layer": "baseline",
        paint: { "line-color": "#2a7f8c", "line-width": 1.5, "line-dasharray": [2, 1] },
      };
    case "forecast_line":
      return {
        type: "line",
        "source-layer": "forecast_line",
        paint: { "line-color": "#d97706", "line-width": 1.6, "line-dasharray": [3, 1.5] },
      };
    case "forecast_uncertainty":
      return {
        type: "fill",
        "source-layer": "forecast_uncertainty",
        paint: { "fill-color": "#d97706", "fill-opacity": 0.18, "fill-outline-color": "#d97706" },
      };
    case "slr_2050":
      return {
        type: "fill",
        "source-layer": "slr_2050",
        paint: { "fill-color": "#2563eb", "fill-opacity": 0.35, "fill-outline-color": "#1e3a8a" },
      };
    default:
      return { type: "line", "source-layer": layerId, paint: { "line-color": neutralLine, "line-width": 1 } };
  }
}
