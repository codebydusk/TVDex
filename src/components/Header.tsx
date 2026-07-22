"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "./ThemeToggle";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="no-print sticky top-0 z-50 glass border-b border-[var(--border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent)] shadow-lg shadow-[var(--accent-glow)] transition-all group-hover:shadow-xl group-hover:shadow-[var(--accent-glow)]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5 text-white"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8" />
                <path d="M12 17v4" />
                <path d="M7 8l3 3-3 3" />
                <line x1="13" y1="13" x2="17" y2="13" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="gradient-text">TV</span>
              <span className="text-[var(--foreground)]">Dex</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            <ThemeToggle />
            <div className="mx-2 h-6 w-px bg-[var(--border)]" />
            <Link
              href="/"
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${pathname === "/"
                ? "bg-[var(--accent)] text-white"
                : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card)]"
                }`}
            >
              Channels
            </Link>
            <Link
              href="/docs"
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${pathname === "/docs"
                ? "bg-[var(--accent)] text-white"
                : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card)]"
                }`}
            >
              API Docs
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
