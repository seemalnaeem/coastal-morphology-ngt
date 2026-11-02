import { REGIONS } from "@shared/index.js";

export default function RegionSelect({ region, onRegion }) {
  return (
    <section>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
        Region
      </h2>
      <div className="flex gap-2">
        {REGIONS.map((r) => {
          const selected = r.id === region;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onRegion(r.id)}
              className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition ${
                selected ? "bg-brand-500 text-white" : "hover:bg-brand-50 dark:hover:bg-brand-700"
              }`}
              style={selected ? { borderColor: "transparent" } : { borderColor: "var(--border)", color: "var(--text)" }}
            >
              {r.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
