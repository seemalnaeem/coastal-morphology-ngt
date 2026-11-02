import RegionSelect from "./RegionSelect.jsx";
import LayerControl from "./LayerControl.jsx";
import Legend from "./Legend.jsx";
import StatsPanel from "./StatsPanel.jsx";

export default function Sidebar({ region, onRegion, active, onToggleLayer, stats, regionLabel, error }) {
  return (
    <aside
      className="no-scrollbar flex w-80 shrink-0 flex-col gap-4 overflow-y-auto border-r p-4"
      style={{ background: "var(--surface-muted)", borderColor: "var(--border)" }}
    >
      <RegionSelect region={region} onRegion={onRegion} />
      <LayerControl active={active} onToggleLayer={onToggleLayer} />
      <Legend />
      <StatsPanel stats={stats} regionLabel={regionLabel} error={error} />
    </aside>
  );
}
