"use client";

import { useState, useMemo } from "react";
import type { Channel } from "@/types";
import { highlightMatch } from "@/lib/utils";

interface ChannelTableProps {
  groupKey: string;
  channels: Channel[];
  searchQuery: string;
  defaultExpanded?: boolean;
}

export default function ChannelTable({
  groupKey,
  channels,
  searchQuery,
  defaultExpanded = false,
}: ChannelTableProps) {
  const [prevDefaultExpanded, setPrevDefaultExpanded] = useState(defaultExpanded);
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [sortField, setSortField] = useState<"name" | "number">("number");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  if (prevDefaultExpanded !== defaultExpanded) {
    setPrevDefaultExpanded(defaultExpanded);
    setExpanded(defaultExpanded);
  }

  const toggleSort = (field: "name" | "number") => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedChannels = useMemo(() => {
    return [...channels].sort((a, b) => {
      let cmp = 0;
      if (sortField === "number") {
        cmp = a.channel_number - b.channel_number;
      } else {
        cmp = a.channel_name.localeCompare(b.channel_name);
      }
      return sortOrder === "asc" ? cmp : -cmp;
    });
  }, [channels, sortField, sortOrder]);

  return (
    <div className="channel-group animate-fade-in">
      {/* Group Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-t-xl bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--card-hover)] transition-all cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <svg
            className={`h-4 w-4 text-[var(--muted)] transition-transform duration-200 ${
              expanded ? "rotate-90" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <h3 className="text-base font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
            {groupKey}
          </h3>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-[var(--accent-glow)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
          {channels.length} {channels.length === 1 ? "Channel" : "Channels"}
        </span>
      </button>

      {/* Table */}
      {expanded && (
        <div className="overflow-x-auto border border-t-0 border-[var(--border)] rounded-b-xl animate-fade-in">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--card)]">
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)] w-16">
                  Sl.
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                  <button
                    onClick={() => toggleSort("name")}
                    className="inline-flex items-center gap-1.5 hover:text-[var(--accent)] transition-colors cursor-pointer select-none"
                    title="Sort by Channel Name"
                  >
                    Channel Name
                    <span className="text-[10px] opacity-75">
                      {sortField === "name"
                        ? sortOrder === "asc"
                          ? "▲ (A-Z)"
                          : "▼ (Z-A)"
                        : "↕"}
                    </span>
                  </button>
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)] w-48 whitespace-nowrap">
                  <button
                    onClick={() => toggleSort("number")}
                    className="inline-flex items-center gap-1.5 hover:text-[var(--accent)] transition-colors cursor-pointer select-none"
                    title="Sort by Jio Channel Number"
                  >
                    Jio Channel No.
                    <span className="text-[10px] opacity-75">
                      {sortField === "number"
                        ? sortOrder === "asc"
                          ? "▲ (1-9)"
                          : "▼ (9-1)"
                        : "↕"}
                    </span>
                  </button>
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)] w-40">
                  Genre
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedChannels.map((ch, idx) => (
                <tr
                  key={ch.id}
                  className={`border-b border-[var(--border)] transition-colors hover:bg-[var(--card-hover)] ${
                    idx % 2 === 0 ? "bg-transparent" : "bg-[var(--card)]/30"
                  }`}
                >
                  <td className="px-4 py-2.5 text-sm text-[var(--muted)] font-mono">
                    {idx + 1}
                  </td>
                  <td className="px-4 py-2.5 text-sm font-medium text-[var(--foreground)]">
                    {highlightMatch(ch.channel_name, searchQuery)}
                  </td>
                  <td className="px-4 py-2.5 text-sm font-mono text-[var(--accent)]">
                    {highlightMatch(
                      ch.channel_number.toString(),
                      searchQuery
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-[var(--muted)]">
                    {ch.genre}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
