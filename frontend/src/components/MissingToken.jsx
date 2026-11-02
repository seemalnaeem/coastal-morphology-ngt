import { FiMap } from "react-icons/fi";

// Shown when VITE_MAPBOX_TOKEN is not set yet. The user adds it to .env later.
export default function MissingToken() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <FiMap className="h-10 w-10 text-brand-500" aria-hidden />
      <h2 className="text-lg font-semibold">Map token needed</h2>
      <p className="max-w-sm text-sm" style={{ color: "var(--text-muted)" }}>
        Set <code>VITE_MAPBOX_TOKEN</code> in your <code>.env</code> file and restart the
        frontend. Everything else (layers, tiles, stats) is ready and will render once the
        token is present.
      </p>
    </div>
  );
}
