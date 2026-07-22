"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import FilterPills from "@/components/FilterPills";
import ChannelTable from "@/components/ChannelTable";
import type { Channel } from "@/types";
import {
  searchChannels,
  filterChannels,
  groupChannels,
} from "@/lib/channels";

const STORAGE_KEY = "tvdex_channels";
const VERSION_KEY = "tvdex_version";

export default function HomePage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [expandOverride, setExpandOverride] = useState<boolean | null>(null);
  const [forceExpandSignal, setForceExpandSignal] = useState<{
    mode: "expand" | "collapse";
    id: number;
  } | null>(null);

  // Reset expand override when filters or search query change
  useEffect(() => {
    setExpandOverride(null);
  }, [selectedLanguages, selectedGenres, searchQuery]);

  const isFilteredOrSearched =
    searchQuery.trim().length > 0 ||
    selectedLanguages.length > 0 ||
    selectedGenres.length > 0;

  const isExpandedState =
    expandOverride !== null ? expandOverride : isFilteredOrSearched;

  const handleExpandAll = useCallback(() => {
    setExpandOverride(true);
    setForceExpandSignal({ mode: "expand", id: Date.now() });
  }, []);

  const handleCollapseAll = useCallback(() => {
    setExpandOverride(false);
    setForceExpandSignal({ mode: "collapse", id: Date.now() });
  }, []);

  // Fetch fresh channel data from the API
  const fetchChannels = useCallback(async () => {
    setLoading(true);
    try {
      const allChannels: Channel[] = [];
      let page = 1;
      let totalPages = 1;

      while (page <= totalPages) {
        const res = await fetch(`/api/channels?limit=200&page=${page}`);
        const json = await res.json();
        allChannels.push(...json.data);
        totalPages = json.pagination.totalPages;
        page++;
      }

      setChannels(allChannels);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allChannels));
        const vRes = await fetch("/api/version");
        const vData = await vRes.json();
        localStorage.setItem(VERSION_KEY, vData.version);
      } catch {
        // localStorage might be full
      }
    } catch (err) {
      console.error("Failed to load channel data:", err);
    }
    setLoading(false);
  }, []);

  // On mount: load channels from localStorage cache, or fetch from API.
  // Using Promise.resolve() keeps setState out of the synchronous effect body.
  useEffect(() => {
    Promise.resolve().then(() => {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          setChannels(JSON.parse(cached));
          setLoading(false);

          // Background version check — re-fetch silently if stale
          fetch("/api/version")
            .then((r) => r.json())
            .then((data) => {
              const cachedVersion = localStorage.getItem(VERSION_KEY);
              if (cachedVersion && cachedVersion !== data.version) {
                try {
                  localStorage.removeItem(STORAGE_KEY);
                  localStorage.removeItem(VERSION_KEY);
                } catch { }
                fetchChannels();
              }
            })
            .catch(() => { });
          return;
        }
      } catch {
        // localStorage not available or corrupt
      }

      // No cache — fetch from API
      fetchChannels();
    });
  }, [fetchChannels]);

  const handleRefreshData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(VERSION_KEY);
    } catch { }
    fetchChannels();
  }, [fetchChannels]);

  // Derived data
  const languages = useMemo(
    () => [...new Set(channels.map((ch) => ch.language))].sort(),
    [channels]
  );

  const genres = useMemo(
    () => [...new Set(channels.map((ch) => ch.genre))].sort(),
    [channels]
  );

  // Both counts use the full intersection of selected languages + genres
  const intersectedChannels = useMemo(
    () => filterChannels(channels, selectedLanguages, selectedGenres),
    [channels, selectedLanguages, selectedGenres]
  );

  const languageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    languages.forEach((lang) => { counts[lang] = 0; });
    intersectedChannels.forEach((ch) => {
      counts[ch.language] = (counts[ch.language] || 0) + 1;
    });
    return counts;
  }, [languages, intersectedChannels]);

  const genreCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    genres.forEach((genre) => { counts[genre] = 0; });
    intersectedChannels.forEach((ch) => {
      counts[ch.genre] = (counts[ch.genre] || 0) + 1;
    });
    return counts;
  }, [genres, intersectedChannels]);

  // Filter and search — reuse lib functions
  const filteredChannels = useMemo(() => {
    let filtered = filterChannels(channels, selectedLanguages, selectedGenres);
    filtered = searchChannels(searchQuery, filtered);
    return filtered;
  }, [channels, selectedLanguages, selectedGenres, searchQuery]);

  // Group channels — reuse lib function
  const groupedChannels = useMemo(() => {
    const groups = groupChannels(filteredChannels, "language_genre");

    // Sort group keys
    const sorted: Record<string, Channel[]> = {};
    Object.keys(groups)
      .sort()
      .forEach((key) => {
        sorted[key] = groups[key];
      });

    return sorted;
  }, [filteredChannels]);

  const toggleLanguage = useCallback((lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  }, []);

  const toggleGenre = useCallback((genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  }, []);

  const handlePrint = useCallback(() => {
    // Check if any table group is currently expanded in the DOM
    const hasExpandedTables = Boolean(
      document.querySelector(".channel-group:not(.no-print)")
    );

    // If all tables are collapsed, auto-expand all for print and collapse back after
    const autoExpanded = !hasExpandedTables;

    if (autoExpanded) {
      handleExpandAll();
    }

    const html = document.documentElement;
    const wasDark = html.classList.contains("dark");

    // Temporarily force light mode for clean PDF output
    if (wasDark) {
      html.classList.remove("dark");
    }

    // Delay to let React render expanded tables and light styles
    setTimeout(() => {
      window.print();

      // Restore dark mode after the print dialog closes
      if (wasDark) {
        html.classList.add("dark");
      }

      // Revert back to collapsed all if we auto-expanded
      if (autoExpanded) {
        handleCollapseAll();
      }
    }, autoExpanded ? 150 : 60);
  }, [handleExpandAll, handleCollapseAll]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)] animate-pulse">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6 text-white"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8" />
                <path d="M12 17v4" />
              </svg>
            </div>
            <p className="text-[var(--muted)]">Loading channel data...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      {/* Print Header */}
      <div className="print-header">
        <div className="print-logo-title">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="print-logo-icon"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8" />
            <path d="M12 17v4" />
            <path d="M7 8l3 3-3 3" />
            <line x1="13" y1="13" x2="17" y2="13" />
          </svg>
          <h1>TVDex — Jio STB Channel Guide</h1>
        </div>
        <p>
          {channels.length} channels across {languages.length} languages •
          Generated on {new Date().toLocaleDateString()}
        </p>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="no-print pt-12 pb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            <span className="gradient-text">Explore</span>{" "}
            <span className="text-[var(--foreground)]">Jio TV Channels</span>
          </h1>
          <p className="text-lg text-[var(--muted)] mx-auto mb-1">
            Search, filter, and discover{" "}
            <span className="text-[var(--accent)] font-semibold">
              {channels.length}+
            </span>{" "}
            channels across{" "}
            <span className="text-[var(--accent)] font-semibold">
              {languages.length}
            </span>{" "}
            languages on JioFiber and JioAirFiber STB.
          </p>
          <p className="text-sm text-[var(--muted)] opacity-80 mx-auto mb-2">
            More STB providers are coming soon.
          </p>
        </section>

        {/* Search */}
        <section className="no-print pb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            totalResults={filteredChannels.length}
            totalChannels={channels.length}
          />
        </section>

        {/* Filters */}
        <section className="no-print pb-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <FilterPills
            label="Languages"
            options={languages}
            selected={selectedLanguages}
            onToggle={toggleLanguage}
            onClear={() => setSelectedLanguages([])}
            counts={languageCounts}
          />
          <FilterPills
            label="Genres"
            options={genres}
            selected={selectedGenres}
            onToggle={toggleGenre}
            onClear={() => setSelectedGenres([])}
            counts={genreCounts}
          />
        </section>

        {/* Results Bar & Expand/Collapse Controls */}
        <div className="no-print pb-4 flex flex-wrap items-center justify-between gap-3 text-sm border-b border-[var(--border)] mb-6">
          <div className="flex items-center gap-2 text-[var(--muted)]">
            <span className="font-semibold text-[var(--foreground)]">
              {filteredChannels.length} {filteredChannels.length === 1 ? "channel" : "channels"} found
            </span>
            {(selectedLanguages.length > 0 || selectedGenres.length > 0 || searchQuery.length > 0) && (
              <>
                <span>•</span>
                <button
                  onClick={() => {
                    setSelectedLanguages([]);
                    setSelectedGenres([]);
                    setSearchQuery("");
                  }}
                  className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors cursor-pointer"
                >
                  Reset filters
                </button>
              </>
            )}
          </div>

          {Object.keys(groupedChannels).length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={handleExpandAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--border-hover)] hover:bg-[var(--card-hover)] transition-all cursor-pointer font-medium"
                title="Expand all channel groups"
              >
                <svg className="h-3.5 w-3.5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Expand All
              </button>
              <button
                onClick={handleCollapseAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--border-hover)] hover:bg-[var(--card-hover)] transition-all cursor-pointer font-medium"
                title="Collapse all channel groups"
              >
                <svg className="h-3.5 w-3.5 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Collapse All
              </button>
            </div>
          )}
        </div>

        {/* Channel Tables */}
        <section className="space-y-4 pb-12">
          {Object.keys(groupedChannels).length === 0 ? (
            <div className="text-center py-16">
              <svg
                className="mx-auto h-16 w-16 text-[var(--muted)] mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-lg font-semibold text-[var(--foreground)]">
                No channels found
              </p>
              <p className="text-sm text-[var(--muted)] mt-1">
                Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            Object.entries(groupedChannels).map(([key, chans]) => (
              <ChannelTable
                key={`${key}-${isExpandedState}`}
                groupKey={key}
                channels={chans}
                searchQuery={searchQuery}
                defaultExpanded={isExpandedState}
                forceExpand={forceExpandSignal}
              />
            ))
          )}
        </section>
      </main>

      {/* Floating Download PDF Action Button */}
      <button
        onClick={handlePrint}
        aria-label="Download PDF"
        title="Download PDF"
        className="no-print fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[var(--accent)] text-white p-3.5 sm:px-5 sm:py-3 shadow-lg shadow-[var(--accent-glow)] hover:bg-[var(--accent-hover)] hover:scale-105 active:scale-95 transition-all cursor-pointer group"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        <span className="hidden sm:inline text-sm font-semibold">Download PDF</span>
      </button>

      <Footer onRefreshData={handleRefreshData} />
    </>
  );
}
