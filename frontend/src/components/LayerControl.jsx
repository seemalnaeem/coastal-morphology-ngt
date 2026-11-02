import { useState } from "react";
import { FiInfo } from "react-icons/fi";
import { VECTOR_LAYERS, RASTER_LAYERS, OVERLAY_LAYERS } from "@shared/index.js";

function LayerRow({ layer, checked, onToggle, open, onInfo }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2 py-1 text-sm">
        <label className="flex flex-1 cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => onToggle(layer.id)}
            className="h-4 w-4 accent-brand-500"
          />
          <span>{layer.label}</span>
        </label>
        {layer.description && (
          <button
            type="button"
            onClick={() => onInfo(layer.id)}
            aria-label={`About ${layer.label}`}
            aria-expanded={open}
            className="rounded p-0.5 transition hover:text-brand-500"
            style={{ color: open ? "#2a7f8c" : "var(--text-muted)" }}
          >
            <FiInfo className="h-4 w-4" />
          </button>
        )}
      </div>
      {layer.description && open && (
        <p
          className="mb-2 ml-6 mr-1 rounded-md border p-2 text-xs leading-snug"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
          {layer.description}
        </p>
      )}
    </div>
  );
}

export default function LayerControl({ active, onToggleLayer }) {
  const [openId, setOpenId] = useState(null);
  const onInfo = (id) => setOpenId((cur) => (cur === id ? null : id));

  return (
    <section>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
        Layers
      </h2>
      <div className="rounded-md border p-2" style={{ borderColor: "var(--border)" }}>
        {VECTOR_LAYERS.map((l) => (
          <LayerRow
            key={l.id}
            layer={l}
            checked={!!active[l.id]}
            onToggle={onToggleLayer}
            open={openId === l.id}
            onInfo={onInfo}
          />
        ))}
        <div className="my-1 border-t" style={{ borderColor: "var(--border)" }} />
        {RASTER_LAYERS.map((l) => (
          <LayerRow
            key={l.id}
            layer={l}
            checked={!!active[l.id]}
            onToggle={onToggleLayer}
            open={openId === l.id}
            onInfo={onInfo}
          />
        ))}
        <div className="my-1 border-t" style={{ borderColor: "var(--border)" }} />
        {OVERLAY_LAYERS.map((l) => (
          <LayerRow
            key={l.id}
            layer={l}
            checked={!!active[l.id]}
            onToggle={onToggleLayer}
            open={openId === l.id}
            onInfo={onInfo}
          />
        ))}
      </div>
    </section>
  );
}
