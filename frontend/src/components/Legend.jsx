import { RATE_COLORS, RATE_LABELS, SLR_RAMP } from "@shared/index.js";

export default function Legend() {
  return (
    <section>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
        Change rate (m/yr)
      </h2>
      <ul className="space-y-1">
        {RATE_COLORS.map((color, i) => (
          <li key={color} className="flex items-center gap-2 text-xs">
            <span className="inline-block h-3 w-5 rounded-sm" style={{ background: color }} />
            <span>{RATE_LABELS[i]}</span>
          </li>
        ))}
      </ul>

      <h2 className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
        Sea level rise
      </h2>
      <div className="flex h-3 w-full overflow-hidden rounded-sm">
        {SLR_RAMP.map((c) => (
          <span key={c} className="flex-1" style={{ background: c }} />
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[10px]" style={{ color: "var(--text-muted)" }}>
        <span>low</span>
        <span>high</span>
      </div>
    </section>
  );
}
