"use client";

interface FilterPillsProps {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
  counts?: Record<string, number>;
}

export default function FilterPills({
  label,
  options,
  selected,
  onToggle,
  onClear,
  counts,
}: FilterPillsProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          {label}
        </h3>
        {selected.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = selected.includes(option);
          const count = counts?.[option];
          return (
            <button
              key={option}
              onClick={() => onToggle(option)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-[var(--accent)] text-white shadow-md shadow-[var(--accent-glow)]"
                  : "bg-[var(--card)] text-[var(--muted)] border border-[var(--border)] hover:border-[var(--border-hover)] hover:text-[var(--foreground)]"
              }`}
            >
              {option}
              {count !== undefined && (
                <span
                  className={`text-xs ${
                    isActive ? "text-white/70" : "text-[var(--muted)]"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
