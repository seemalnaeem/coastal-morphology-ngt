---
name: add-map-layer
description: Surface a new vector or raster layer on the frontend map end to end. Use after the data is in PostGIS or a COG.
---

# Add a map layer

Walks the full seam from database to map. Touches db, backend, frontend.

1. **db**: confirm the layer is a case in `mvt_tile()` and has a GIST index.
2. **backend**: the generic `/tiles/:layer/:z/:x/:y.pbf` route already serves any
   `mvt_tile` layer. Add a REST endpoint only if the UI needs attributes or stats.
3. **shared**: add the layer id, label, geometry type, and style to
   `shared/constants/layers.js` so backend and frontend agree.
4. **frontend**:
   - vectors: add a `Source` (type `vector`, tiles = `${VITE_API_URL}/tiles/<layer>/{z}/{x}/{y}.pbf`)
     and a styled `Layer` keyed off the shared color ramp.
   - raster: add a `raster` source from
     `${VITE_TITILER_URL}/cog/tiles/WebMercatorQuad/{z}/{x}/{y}.png?url=...` (this TiTiler
     build requires the WebMercatorQuad matrix set in the path).
   - register it in the layer control and legend. Respect region and theme.

Done when: the layer toggles on, draws in both themes, and the legend matches the breaks.
