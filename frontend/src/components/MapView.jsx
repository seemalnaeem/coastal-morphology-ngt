import { useCallback, useEffect, useRef, useState } from "react";
import Map, { Source, Layer, Marker, NavigationControl, ScaleControl, Popup } from "react-map-gl";
import { FiPlay, FiSquare, FiX } from "react-icons/fi";
import {
  VECTOR_LAYERS,
  RASTER_LAYERS,
  DTW_RAMP,
  DTW_RANGE,
  formatRate,
  formatMeters,
} from "@shared/index.js";
import {
  MAPBOX_TOKEN,
  TITILER_URL,
  SLR_BOUNDS,
  DTW_BOUNDS,
  SLR_2050_BOUNDS,
  INITIAL_VIEW,
} from "../lib/config.js";
import { tileUrl, api } from "../lib/api.js";
import { MAPBOX_STYLE, vectorLayerStyle } from "../lib/mapStyles.js";
import {
  TOUR_STOPS,
  layersActive,
  trendSentence,
  flyToAsync,
  fitBoundsAsync,
  easeToAsync,
  animateValue,
  spin,
  waitFor,
} from "../lib/tour.js";
import MissingToken from "./MissingToken.jsx";

const SLR_LAYER = RASTER_LAYERS.find((l) => l.id === "slr_impact");
const DTW_LAYER = RASTER_LAYERS.find((l) => l.id === "dtw");
const TRANSECT_LAYER = VECTOR_LAYERS.find((l) => l.id === "transect");

// A fixed, readable panel on the right. Used for the erosion trend and the SLR write-ups.
// It stays put while the camera flies or spins, so the text never becomes hard to read.
function InfoPanel({ title, text, onClose }) {
  return (
    <div
      className="tour-card absolute right-3 top-16 z-10 w-96 max-w-[90vw] overflow-y-auto rounded-lg border p-4 shadow-lg"
      style={{
        maxHeight: "calc(100% - 7rem)",
        background: "var(--surface)",
        borderColor: "var(--border)",
        color: "var(--text)",
      }}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold leading-tight">{title}</h3>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-0.5 transition hover:text-brand-500"
            style={{ color: "var(--text-muted)" }}
          >
            <FiX className="h-5 w-5" />
          </button>
        )}
      </div>
      <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
        {text}
      </p>
    </div>
  );
}

// Build a TiTiler tile url for a COG with a rescale window and named colormap. This
// TiTiler build needs the WebMercatorQuad matrix set in the path.
function rasterTileUrl(cogName, rescale, colormap) {
  const params = new URLSearchParams({
    url: `file:///data/cog/${cogName}`,
    rescale,
    colormap_name: colormap,
  });
  return `${TITILER_URL}/cog/tiles/WebMercatorQuad/{z}/{x}/{y}.png?${params.toString()}`;
}

export default function MapView({ theme, region, active, setRegion, setActive }) {
  const mapRef = useRef(null);
  const tokenRef = useRef({ cancelled: false });
  const [popup, setPopup] = useState(null);
  const [tour, setTour] = useState({ running: false, narration: "", pulse: null, panel: null });
  const [slrInfoOpen, setSlrInfoOpen] = useState(true);
  const [slrOpacity, setSlrOpacity] = useState(0.75);
  const [dtwYear, setDtwYear] = useState(DTW_LAYER.years[0]);
  const [dtwAuto, setDtwAuto] = useState(true);

  // Reopen the sea level rise callout each time that layer is switched on.
  useEffect(() => {
    if (active.slr_impact) setSlrInfoOpen(true);
  }, [active.slr_impact]);

  // When the depth to water table comparison turns on, start from the first year in auto.
  useEffect(() => {
    if (active.dtw) {
      setDtwAuto(true);
      setDtwYear(DTW_LAYER.years[0]);
    }
  }, [active.dtw]);

  // Auto advance the year so the 2020 vs 2030 change reads on its own, no explaining needed.
  useEffect(() => {
    if (!active.dtw || !dtwAuto) return;
    const years = DTW_LAYER.years;
    const id = setInterval(() => {
      setDtwYear((y) => years[(years.indexOf(y) + 1) % years.length]);
    }, 2200);
    return () => clearInterval(id);
  }, [active.dtw, dtwAuto]);

  // When 3D buildings are switched on manually, move to the Karachi shoreline and tilt so
  // the extrusions are actually visible (they only render from zoom 13 up). Skip during the
  // tour, which drives the camera itself.
  useEffect(() => {
    if (!active.buildings3d || tour.running) return;
    const map = mapRef.current?.getMap();
    if (!map) return;
    if (map.getZoom() < 13) {
      map.flyTo({ center: [66.98, 24.84], zoom: 15.3, pitch: 60, bearing: 24, duration: 2500 });
    } else if (map.getPitch() < 30) {
      map.easeTo({ pitch: 60, duration: 1200 });
    }
  }, [active.buildings3d, tour.running]);

  const onClick = useCallback(
    (e) => {
      if (tour.running) return; // ignore clicks mid tour
      const f = e.features?.find((feat) => feat.layer.id === "layer-transect");
      if (!f) return setPopup(null);
      setPopup({ lngLat: e.lngLat, props: f.properties || {} });
    },
    [tour.running]
  );

  async function runTour() {
    const map = mapRef.current?.getMap();
    if (!map) return;
    setPopup(null);
    const token = { cancelled: false };
    tokenRef.current = token;
    setTour({ running: true, narration: "Starting the coastal tour...", pulse: null, panel: null });

    for (const stop of TOUR_STOPS) {
      if (token.cancelled) break;
      // Drive the shared app state so the sidebar and layers follow the tour.
      setRegion(stop.region);
      setActive(layersActive(stop.layers));
      setTour({ running: true, narration: `Flying to ${stop.title}...`, pulse: null, panel: null });

      await flyToAsync(map, {
        center: stop.center,
        zoom: stop.zoom,
        pitch: stop.pitch,
        bearing: 0,
        duration: 4500,
      });
      if (token.cancelled) break;

      let row = null;
      try {
        const data = await api.stats(stop.region);
        row = data.stats?.[0];
      } catch {
        row = null;
      }
      setTour({
        running: true,
        narration: trendSentence(stop.title, row),
        pulse: { lng: stop.center[0], lat: stop.center[1] },
        panel: stop.showTrendInfo ? "transect" : null,
      });

      await spin(map, stop.spinDegrees, stop.spinMs, token);
      if (token.cancelled) break;

      // Reveal the sea level rise raster from above, fading it in from low to high.
      if (stop.slrReveal) {
        setTour({
          running: true,
          narration: "Sea level rise impact at Karachi, rising from low to high. See the panel on the right.",
          pulse: { lng: stop.center[0], lat: stop.center[1] },
          panel: null,
        });
        // Frame the whole raster from above so the full layer is visible in the extent.
        await fitBoundsAsync(map, SLR_BOUNDS, { padding: 48, pitch: 0, bearing: 0, duration: 2400 });
        if (token.cancelled) break;
        setActive(layersActive([...stop.layers, "slr_impact"]));
        setSlrOpacity(0);
        await waitFor(400); // let the raster source mount before fading in
        await animateValue(0, 0.85, stop.slrReveal.durationMs, setSlrOpacity, token);
        if (token.cancelled) break;
        await waitFor(1500);
      }

      // Compare depth to water table across 2020 and 2030. The year control auto cycles,
      // so the deepening water table reads on its own.
      if (stop.dtwCompare) {
        setActive(layersActive(["shoreline", "dtw"]));
        setTour({
          running: true,
          narration: "Depth to water table, 2020 compared to 2030. Warmer colors show a deeper, more stressed water table.",
          pulse: { lng: stop.center[0], lat: stop.center[1] },
          panel: null,
        });
        await fitBoundsAsync(map, DTW_BOUNDS, { padding: 48, pitch: 0, bearing: 0, duration: 2000 });
        if (token.cancelled) break;
        await waitFor(stop.dtwCompare.durationMs);
        if (token.cancelled) break;
      }

      // The 2050 flood footprint in 3D: show the whole extent first, zoom in to the shore
      // so buildings are visible, then sweep from the shore inland until the layer ends.
      if (stop.build3d) {
        const b = stop.build3d;
        setActive(layersActive(["slr_2050", "shoreline", "buildings3d"]));
        setTour({
          running: true,
          narration: "Sea level rise flood 2050. The whole inundation footprint along the Karachi and Indus delta coast.",
          pulse: null,
          panel: null,
        });
        // 1) whole flood extent in view
        await fitBoundsAsync(map, SLR_2050_BOUNDS, { padding: 40, pitch: 0, bearing: 0, duration: 2600 });
        if (token.cancelled) break;
        await waitFor(1600);
        if (token.cancelled) break;

        // 2) zoom in to the shore, then 3) sweep from shore to inland through the waypoints
        setTour({
          running: true,
          narration: "Karachi shoreline in 3D. Buildings inside the blue 2050 flood extent are the most exposed.",
          pulse: null,
          panel: null,
        });
        for (let i = 0; i < b.path.length; i++) {
          const wp = b.path[i];
          const move = i === 0 ? flyToAsync : easeToAsync; // fly in first, then glide along
          await move(map, {
            center: wp.center,
            zoom: wp.zoom,
            pitch: wp.pitch,
            bearing: wp.bearing,
            duration: wp.duration,
          });
          if (token.cancelled) break;
        }
        if (token.cancelled) break;
        await waitFor(b.holdMs);
        if (token.cancelled) break;
      }

      // Hold still on the sea level rise view so the raster and its panel read clearly.
      if (stop.holdForRaster) {
        setTour({
          running: true,
          narration: "Sea level rise impact and seawater intrusion risk for 2030. See the panel on the right.",
          pulse: { lng: stop.center[0], lat: stop.center[1] },
          panel: null,
        });
        map.easeTo({ pitch: 0, bearing: 0, duration: 1600 });
        await waitFor(4000);
        if (token.cancelled) break;
      }
      await waitFor(700);
    }

    map.easeTo({ pitch: 0, bearing: 0, duration: 1500 });
    setSlrOpacity(0.75);
    setTour({ running: false, narration: "", pulse: null, panel: null });
  }

  function stopTour() {
    tokenRef.current.cancelled = true;
    const map = mapRef.current?.getMap();
    if (map) map.easeTo({ pitch: 0, bearing: 0, duration: 1000 });
    setSlrOpacity(0.75);
    setTour({ running: false, narration: "", pulse: null, panel: null });
  }

  if (!MAPBOX_TOKEN) return <MissingToken />;

  const interactive = active.transect ? ["layer-transect"] : [];

  return (
    <Map
      ref={mapRef}
      reuseMaps
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={INITIAL_VIEW}
      mapStyle={MAPBOX_STYLE[theme]}
      interactiveLayerIds={interactive}
      onClick={onClick}
      style={{ position: "absolute", inset: 0 }}
    >
      <NavigationControl position="top-right" />
      <ScaleControl position="bottom-right" />

      {/* Rasters first so vectors draw on top. */}
      {active.slr_impact && (
        <Source
          key="slr"
          id="slr"
          type="raster"
          tiles={[rasterTileUrl(SLR_LAYER.cog, SLR_LAYER.rescale, SLR_LAYER.colormap)]}
          tileSize={256}
        >
          <Layer id="layer-slr" type="raster" paint={{ "raster-opacity": slrOpacity }} />
        </Source>
      )}

      {/* Depth to water table: both years mounted, only the current year shown, so the
          2020 vs 2030 toggle switches instantly without reloading tiles. */}
      {active.dtw &&
        DTW_LAYER.years.map((yr) => (
          <Source
            key={`dtw-${yr}`}
            id={`dtw-${yr}`}
            type="raster"
            tiles={[rasterTileUrl(DTW_LAYER.cogs[yr], DTW_LAYER.rescale, DTW_LAYER.colormap)]}
            tileSize={256}
          >
            <Layer
              id={`layer-dtw-${yr}`}
              type="raster"
              paint={{ "raster-opacity": yr === dtwYear ? 0.85 : 0 }}
            />
          </Source>
        ))}

      {/* Coastal erosion trend text, shown while the Sindh transects are on during the
          tour, before the sea level rise reveal. */}
      {tour.running && tour.panel === "transect" && region === "sindh" && (
        <InfoPanel
          title="Coastal erosion trends, Sindh (DSAS WLR analysis)"
          text={TRANSECT_LAYER?.description}
        />
      )}

      {/* Seawater intrusion assessment text, fixed on the right so it stays readable even
          while the camera flies or spins. The assessment is Sindh specific, so it shows
          only for the Sindh region and hides once the tour flies to Balochistan. */}
      {active.slr_impact && region === "sindh" && slrInfoOpen && (
        <InfoPanel
          title="Seawater intrusion vulnerability (2030)"
          text={SLR_LAYER?.description}
          onClose={() => setSlrInfoOpen(false)}
        />
      )}

      {VECTOR_LAYERS.map((l) => {
        if (!active[l.id]) return null;
        const style = vectorLayerStyle(l.id, theme);
        return (
          <Source
            key={`${l.id}-${region}`}
            id={`src-${l.id}`}
            type="vector"
            tiles={[tileUrl(l.id, region)]}
            minzoom={0}
            maxzoom={22}
          >
            <Layer id={`layer-${l.id}`} {...style} />
          </Source>
        );
      })}

      {/* 3D building footprints, extruded from the basemap composite source. Visible when
          the map is pitched, so you can see which buildings sit inside the flood extent. */}
      {active.buildings3d && (
        <Layer
          id="layer-buildings3d"
          type="fill-extrusion"
          source="composite"
          source-layer="building"
          minzoom={13}
          filter={["==", ["get", "extrude"], "true"]}
          paint={{
            "fill-extrusion-color": theme === "dark" ? "#7c8aa0" : "#aeb8c6",
            "fill-extrusion-height": ["get", "height"],
            "fill-extrusion-base": ["get", "min_height"],
            "fill-extrusion-opacity": 0.9,
          }}
        />
      )}

      {/* Blinking pulse at the current tour stop. */}
      {tour.pulse && (
        <Marker longitude={tour.pulse.lng} latitude={tour.pulse.lat} anchor="center">
          <div className="pulse-dot">
            <span className="pulse-ring" />
            <span className="pulse-core" />
          </div>
        </Marker>
      )}

      {/* Tour control, top left so it clears the navigation control. */}
      <div className="absolute left-3 top-3 z-10">
        <button
          type="button"
          onClick={tour.running ? stopTour : runTour}
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white shadow transition"
          style={{ background: tour.running ? "#b45309" : "#2a7f8c" }}
        >
          {tour.running ? <FiSquare className="h-4 w-4" /> : <FiPlay className="h-4 w-4" />}
          {tour.running ? "Stop tour" : "Play guided tour"}
        </button>
      </div>

      {/* Depth to water table comparison control: a year toggle that auto cycles plus a
          shallow to deep legend, so the 2020 vs 2030 change is self explanatory. */}
      {active.dtw && (
        <div
          className="tour-card absolute left-1/2 top-3 z-10 -translate-x-1/2 rounded-lg border px-3 py-2 shadow-lg"
          style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
        >
          <div className="flex items-center justify-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
              Depth to water table
            </span>
            <div className="flex overflow-hidden rounded-md border" style={{ borderColor: "var(--border)" }}>
              {DTW_LAYER.years.map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => {
                    setDtwAuto(false);
                    setDtwYear(yr);
                  }}
                  className="px-3 py-1 text-sm font-semibold transition"
                  style={yr === dtwYear ? { background: "#2a7f8c", color: "#fff" } : { color: "var(--text)" }}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2 w-56">
            <div className="flex h-2.5 w-full overflow-hidden rounded-sm">
              {DTW_RAMP.map((c) => (
                <span key={c} className="flex-1" style={{ background: c }} />
              ))}
            </div>
            <div className="mt-0.5 flex justify-between text-[10px]" style={{ color: "var(--text-muted)" }}>
              <span>Shallow ({DTW_RANGE[0]} m)</span>
              <span>Deep ({DTW_RANGE[1]}+ m)</span>
            </div>
          </div>
        </div>
      )}

      {/* Narration card. */}
      {tour.running && tour.narration && (
        <div
          className="tour-card absolute bottom-6 left-3 z-10 max-w-sm rounded-lg border p-3 shadow-lg"
          style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
        >
          <div className="text-[10px] font-semibold uppercase tracking-wide text-brand-500">
            Coastal trend
          </div>
          <p className="mt-1 text-sm leading-snug">{tour.narration}</p>
        </div>
      )}

      {popup && (
        <Popup
          longitude={popup.lngLat.lng}
          latitude={popup.lngLat.lat}
          onClose={() => setPopup(null)}
          closeOnClick={false}
          anchor="bottom"
        >
          <div className="text-xs text-slate-900">
            <div className="font-semibold">Transect {popup.props.transect_id}</div>
            <div>WLR {formatRate(Number(popup.props.wlr))}</div>
            <div>EPR {formatRate(Number(popup.props.epr))}</div>
            <div>NSM {formatMeters(Number(popup.props.nsm))}</div>
          </div>
        </Popup>
      )}
    </Map>
  );
}
