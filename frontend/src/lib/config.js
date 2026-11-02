// Runtime config from Vite env. Mapbox token is added by the user later.
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3046";
export const TITILER_URL = import.meta.env.VITE_TITILER_URL || "http://localhost:3048";
export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "";

// The SLR COG as TiTiler sees it on its mounted volume.
export const SLR_COG_URL = "file:///data/cog/slr_impact.tif";

// Full extent of the sea level rise raster, [[west, south], [east, north]]. Used to frame
// the whole layer in view. Matches the COG bounds reported by TiTiler.
export const SLR_BOUNDS = [
  [66.6541, 23.7031],
  [71.1307, 27.7287],
];

// Full extent of the depth to water table rasters (same study area as SLR).
export const DTW_BOUNDS = [
  [66.6541, 23.7031],
  [71.1273, 27.7289],
];

// Extent of the 2050 flood footprint (ssl2050), Karachi to the Indus delta.
export const SLR_2050_BOUNDS = [
  [66.774, 23.55],
  [68.345, 24.965],
];

// Pakistan coast, a sensible starting view over the Sindh and Balochistan shoreline.
export const INITIAL_VIEW = { longitude: 66.9, latitude: 24.6, zoom: 6.2 };
