import { FiMoon, FiSun } from "react-icons/fi";

export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium transition hover:bg-brand-50 dark:hover:bg-brand-700"
      style={{ borderColor: "var(--border)", color: "var(--text)" }}
    >
      {isDark ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
      {isDark ? "Light" : "Dark"}
    </button>
  );
}
