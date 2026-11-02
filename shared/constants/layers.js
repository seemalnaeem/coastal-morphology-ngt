// The layer catalog. `id` is the MVT tile layer name and the PostGIS table name.
// Keep this list aligned with db/migrations and .claude/rules/data-contract.md.

export const REGIONS = [
  { id: "sindh", label: "Sindh" },
  { id: "balochistan", label: "Balochistan" },
];

// Layer write-ups. Em dashes and smart quotes are converted to commas, parentheses, and
// plain quotes, and the date range en dash to "to", per project style.
const TRANSECT_INFO =
  "Shoreline change analysis along the Sindh coast was conducted using NASA's Digital " +
  "Shoreline Analysis System (DSAS), employing the Weighted Linear Regression (WLR) method " +
  "to quantify long-term shoreline movement while accounting for positional uncertainty in " +
  "multi-temporal shoreline datasets. The WLR results indicate that extensive sections of " +
  "the Sindh coastline, particularly the Indus Delta region encompassing Thatta and Sujawal " +
  "districts, are experiencing persistent and statistically robust erosion, characterized by " +
  "negative shoreline change rates. Higher erosion magnitudes are observed in low-lying " +
  "deltaic zones where reduced sediment discharge from the Indus River, combined with tidal " +
  "forcing and relative sea-level rise, amplifies shoreline retreat. In contrast, localized " +
  "accretion or reduced erosion rates are identified near structurally modified coastlines, " +
  "notably around Karachi, reflecting the influence of coastal engineering and urban " +
  "development. Overall, the WLR-based analysis demonstrates a dominance of erosional trends " +
  "over accretion along the Sindh coast, underscoring increasing coastal instability and " +
  "heightened vulnerability to future sea-level rise and seawater intrusion.";

const DTW_INFO =
  "Depth to water table in meters, comparing 2020 and 2030. Cooler colors are shallow " +
  "groundwater, warmer colors are deeper. The water table deepens by 2030, a sign of growing " +
  "groundwater stress that raises the risk of seawater intrusion along the Sindh coast.";

const SLR_2050_INFO =
  "Projected sea level rise inundation extent for 2050 along the Karachi and Indus delta " +
  "coast. Areas inside this footprint are at risk of permanent or periodic flooding under " +
  "the 2050 projection.";

const BUILDINGS_INFO =
  "Building footprints near the Karachi shoreline shown in 3D. Tilt the map to see which " +
  "structures fall inside the 2050 sea level rise flood extent.";

// Verbatim assessment text supplied for the sea level rise layer.
const SLR_INFO =
  "Seawater intrusion vulnerability for 2030 was assessed using an integrated conceptual " +
  "framework combining IPCC AR6 sea-level rise projections, coastal proximity influence, and " +
  "projected groundwater depth dynamics. Scenario-based sea-level rise values were spatially " +
  "distributed inland using a normalized distance-to-coast influence factor to represent " +
  "declining marine pressure with distance from the shoreline. Groundwater susceptibility was " +
  "incorporated through projected Depth to Water Table (DTW), estimated by applying baseline " +
  "groundwater decline rates and population-driven abstraction pressure to current DTW " +
  "conditions. The combined analysis captures both marine forcing and terrestrial groundwater " +
  "stress influencing saline intrusion potential. Results indicate elevated intrusion risk " +
  "along coastal and deltaic districts of Sindh, with risk extending inland where groundwater " +
  "levels are shallow and abstraction pressure is high, highlighting zones of compounded " +
  "vulnerability by 2030.";

export const VECTOR_LAYERS = [
  // Flood fill first so it draws beneath the line layers.
  {
    id: "slr_2050",
    label: "Sea level rise flood 2050",
    geometry: "polygon",
    defaultOn: false,
    description: SLR_2050_INFO,
  },
  {
    id: "transect",
    label: "Transects (change rate)",
    geometry: "line",
    styleBy: "wlr", // symbolized on weighted linear regression rate
    defaultOn: true,
    description: TRANSECT_INFO,
  },
  { id: "shoreline", label: "Historical shorelines", geometry: "line", defaultOn: true },
  { id: "baseline", label: "Baselines", geometry: "line", defaultOn: false },
  { id: "forecast_line", label: "10 year forecast line", geometry: "line", defaultOn: false },
  { id: "forecast_uncertainty", label: "Forecast uncertainty", geometry: "polygon", defaultOn: false },
];

// Frontend only overlays that do not come from a backend tile endpoint. 3D buildings are
// extruded from the Mapbox basemap composite source.
export const OVERLAY_LAYERS = [
  { id: "buildings3d", label: "3D buildings (Karachi)", defaultOn: false, description: BUILDINGS_INFO },
];

export const RASTER_LAYERS = [
  {
    id: "slr_impact",
    label: "Sea level rise impact",
    cog: "slr_impact.tif",
    rescale: "0.09996,0.1",
    colormap: "spectral",
    defaultOn: false,
    description: SLR_INFO,
  },
  {
    // A 2020 vs 2030 comparison, shown as an animated year toggle so the change reads on
    // its own. Same rescale and ramp for both years so the comparison is fair.
    id: "dtw",
    label: "Depth to water table (2020 vs 2030)",
    kind: "comparison",
    years: [2020, 2030],
    cogs: { 2020: "dtw_2020.tif", 2030: "dtw_2030.tif" },
    rescale: "1,5",
    colormap: "rdylbu_r",
    defaultOn: false,
    description: DTW_INFO,
  },
];

export const VECTOR_LAYER_IDS = VECTOR_LAYERS.map((l) => l.id);

export function isVectorLayer(id) {
  return VECTOR_LAYER_IDS.includes(id);
}
