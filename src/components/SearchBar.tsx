"use client";

import { useRef, useEffect, useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  totalResults: number;
  totalChannels: number;
}

export default function SearchBar({
  value,
  onChange,
  totalResults,
  totalChannels,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !isFocused) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        inputRef.current?.blur();
        onChange("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocused, onChange]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div
        className={`relative flex items-center rounded-xl transition-all duration-300 ${
          isFocused
            ? "ring-2 ring-[var(--accent)] shadow-lg shadow-[var(--accent-glow)]"
            : "ring-1 ring-[var(--border)]"
        } bg-[var(--card)]`}
      >
        {/* Search Icon */}
        <div className="pointer-events-none absolute left-4">
          <svg
            className={`h-5 w-5 transition-colors ${
              isFocused ? "text-[var(--accent)]" : "text-[var(--muted)]"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          ref={inputRef}
          type="text"
          placeholder="Search by channel name or number..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full bg-transparent py-4 pl-12 pr-24 text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none text-base"
        />

        {/* Keyboard shortcut hint */}
        <div className="absolute right-4 flex items-center gap-2">
          {value && (
            <button
              onClick={() => onChange("")}
              className="rounded-md p-1 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card-hover)] transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {!isFocused && !value && (
            <kbd className="hidden sm:inline-flex items-center rounded-md border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--muted)] font-mono">
              /
            </kbd>
          )}
        </div>
      </div>

      {/* Results count */}
      {value && (
        <p className="mt-2 text-center text-sm text-[var(--muted)] animate-fade-in">
          Found{" "}
          <span className="font-semibold text-[var(--accent)]">
            {totalResults}
          </span>{" "}
          of {totalChannels} channels
        </p>
      )}
    </div>
  );
}
