import { TbWaveSine } from "react-icons/tb";
import ThemeToggle from "./ThemeToggle.jsx";

export default function Header({ theme, onToggleTheme }) {
  return (
    <header
      className="relative flex items-center justify-center border-b px-4 py-3"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center gap-3 text-center">
        <TbWaveSine className="h-8 w-8 shrink-0 text-brand-500" aria-hidden />
        <div>
          <h1 className="text-2xl font-semibold leading-tight">Coastal Morphology Portal</h1>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Shoreline change and sea level rise, Pakistan coast
          </p>
        </div>
      </div>
      <div className="absolute right-4">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}
