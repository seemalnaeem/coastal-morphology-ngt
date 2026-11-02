import { useEffect, useMemo, useState } from "react";
import { api } from "./lib/api.js";
import { useTheme } from "./lib/useTheme.js";
import { VECTOR_LAYERS, RASTER_LAYERS, OVERLAY_LAYERS, REGIONS } from "@shared/index.js";
import MapView from "./components/MapView.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";

// Default visible layers come from the shared catalog.
function defaultActive() {
  const active = {};
  [...VECTOR_LAYERS, ...RASTER_LAYERS, ...OVERLAY_LAYERS].forEach((l) => (active[l.id] = !!l.defaultOn));
  return active;
}

export default function App() {
  const { theme, toggle } = useTheme();
  const [region, setRegion] = useState("sindh");
  const [active, setActive] = useState(defaultActive);
  const [stats, setStats] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .stats(region)
      .then((d) => setStats(d.stats))
      .catch((e) => setError(e.message));
  }, [region]);

  const toggleLayer = (id) => setActive((a) => ({ ...a, [id]: !a[id] }));

  const regionLabel = useMemo(
    () => REGIONS.find((r) => r.id === region)?.label || region,
    [region]
  );

  return (
    <div className="flex h-full flex-col">
      <Header theme={theme} onToggleTheme={toggle} />
      <div className="flex min-h-0 flex-1">
        <Sidebar
          region={region}
          onRegion={setRegion}
          active={active}
          onToggleLayer={toggleLayer}
          stats={stats}
          regionLabel={regionLabel}
          error={error}
        />
        <main className="relative min-w-0 flex-1">
          <MapView
            theme={theme}
            region={region}
            active={active}
            setRegion={setRegion}
            setActive={setActive}
          />
        </main>
      </div>
    </div>
  );
}
