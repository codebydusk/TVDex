"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[var(--card)] border border-[var(--border)] glass transition-all duration-300 hover:border-[var(--accent)] hover:shadow-[0_0_15px_var(--accent-glow)] focus:outline-none cursor-pointer overflow-hidden group"
      aria-label="Toggle theme"
      title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
    >
      <div className="relative flex items-center justify-center w-full h-full">
        <Sun
          size={18}
          className={`absolute transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isDark
              ? "opacity-0 -rotate-90 scale-50 text-[var(--muted)]"
              : "opacity-100 rotate-0 scale-100 text-[var(--accent)]"
          }`}
        />
        <Moon
          size={18}
          className={`absolute transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isDark
              ? "opacity-100 rotate-0 scale-100 text-[var(--accent)]"
              : "opacity-0 rotate-90 scale-50 text-[var(--muted)]"
          }`}
        />
      </div>
    </button>
  );
}
