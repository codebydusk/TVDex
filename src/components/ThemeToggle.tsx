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
    return <div className="w-14 h-7" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center w-14 h-7 rounded-full bg-[var(--card)] border border-[var(--border)] transition-colors focus:outline-none hover:border-[var(--border-hover)] cursor-pointer"
      aria-label="Toggle theme"
    >
      <span className="absolute left-1.5 text-[var(--muted)] opacity-50">
        <Sun size={12} />
      </span>
      <span className="absolute right-1.5 text-[var(--muted)] opacity-50">
        <Moon size={12} />
      </span>
      <span
        className={`absolute left-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--foreground)] text-[var(--background)] transition-transform duration-300 ${
          isDark ? "translate-x-7" : "translate-x-0"
        }`}
      >
        {isDark ? (
          <Moon size={12} fill="currentColor" />
        ) : (
          <Sun size={12} fill="currentColor" />
        )}
      </span>
    </button>
  );
}
