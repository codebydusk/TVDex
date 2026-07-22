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
                } catch {}
                fetchChannels();
              }
            })
            .catch(() => {});
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
    } catch {}
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
    window.print();
  }, []);

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
        <h1>TVDex — Jio STB Channel Guide</h1>
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
          <div className="flex items-center justify-center gap-4 mt-4">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--card)] border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--border-hover)] transition-all"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              API Docs
            </Link>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--card)] border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--border-hover)] transition-all cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Download PDF
            </button>
          </div>
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

        {/* Active filters summary */}
        {(selectedLanguages.length > 0 || selectedGenres.length > 0) && (
          <div className="no-print pb-4 flex items-center gap-2 text-sm text-[var(--muted)]">
            <span>Showing {filteredChannels.length} channels</span>
            <button
              onClick={() => {
                setSelectedLanguages([]);
                setSelectedGenres([]);
                setSearchQuery("");
              }}
              className="text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        )}

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
                key={key}
                groupKey={key}
                channels={chans}
                searchQuery={searchQuery}
                defaultExpanded={
                  Object.keys(groupedChannels).length <= 5 ||
                  searchQuery.length > 0
                }
              />
            ))
          )}
        </section>
      </main>

      <Footer onRefreshData={handleRefreshData} />
    </>
  );
}
