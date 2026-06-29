"use client";

interface FooterProps {
  onRefreshData?: () => void;
}

export default function Footer({ onRefreshData }: FooterProps) {
  return (
    <footer className="no-print mt-20 border-t border-[var(--border)] bg-[var(--card)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 text-white"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8" />
                  <path d="M12 17v4" />
                </svg>
              </div>
              <span className="font-bold text-lg">
                <span className="gradient-text">TV</span>Dex
              </span>
            </div>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              The smartest way to explore TV channels. Search, filter, and
              discover across 800+ channels in 12 languages.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-[var(--muted)] mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/"
                  className="text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
                >
                  Channel Guide
                </a>
              </li>
              <li>
                <a
                  href="/docs"
                  className="text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
                >
                  API Documentation
                </a>
              </li>
              <li>
                <button
                  onClick={onRefreshData}
                  className="text-[var(--foreground)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                >
                  ↻ Refresh Channel Data
                </button>
              </li>
            </ul>
          </div>

          {/* Developer Credits */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-[var(--muted)] mb-3">
              Developer Credits
            </h4>
            <p className="text-sm text-[var(--muted)] leading-relaxed mb-2">
              Built with ❤️ for the Indian TV community.
            </p>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Open source — contributions welcome!
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              View on GitHub
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--border)] text-center text-xs text-[var(--muted)]">
          <p>
            TVDex © {new Date().getFullYear()} • Data sourced from official
            channel lists • Not affiliated with any DTH/cable provider
          </p>
        </div>
      </div>
    </footer>
  );
}
