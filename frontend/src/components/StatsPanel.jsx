import { formatRate, formatMeters, formatPercent } from "@shared/index.js";

function Stat({ label, value }) {
  return (
    <div className="rounded-md border p-2" style={{ borderColor: "var(--border)" }}>
      <div className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
        {label}
      </div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}

export default function StatsPanel({ stats, regionLabel, error }) {
  const row = stats?.[0];

  return (
    <section>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
        {regionLabel} summary
      </h2>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {!error && !row && <p className="text-xs" style={{ color: "var(--text-muted)" }}>Loading or no data yet.</p>}
      {row && (
        <div className="grid grid-cols-2 gap-2">
          <Stat label="Transects" value={row.transects} />
          <Stat label="Mean EPR" value={formatRate(row.meanEpr)} />
          <Stat label="Mean NSM" value={formatMeters(row.meanNsm)} />
          <Stat label="Eroding" value={formatPercent(row.pctEroding)} />
          <Stat label="Accreting" value={formatPercent(row.pctAccreting)} />
          <Stat label="Max erosion" value={formatRate(row.maxErosion)} />
        </div>
      )}
    </section>
  );
}
