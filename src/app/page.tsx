"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import FilterPills from "@/components/FilterPills";
import ChannelTable from "@/components/ChannelTable";

interface Channel {
  id: string;
  channel_number: number;
  channel_name: string;
  genre: string;
  language: string;
}

const STORAGE_KEY = "tvdex_channels";
const VERSION_KEY = "tvdex_version";

export default function HomePage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  // Load data from localStorage or fetch
  const loadData = useCallback(async (forceRefresh = false) => {
    setLoading(true);

    if (!forceRefresh) {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          setChannels(parsed);
          setLoading(false);

          // Background version check
          fetch("/api/version")
            .then((r) => r.json())
            .then((data) => {
              const cachedVersion = localStorage.getItem(VERSION_KEY);
              if (cachedVersion && cachedVersion !== data.version) {
                // Version mismatch — re-fetch
                loadData(true);
              }
            })
            .catch(() => {});
          return;
        }
      } catch {
        // localStorage not available or corrupt
      }
    }

    try {
      const res = await fetch("/data/jio_stb_channels.json");
      const data: Channel[] = await res.json();
      setChannels(data);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        // Also fetch and store version
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

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefreshData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(VERSION_KEY);
    } catch {}
    loadData(true);
  }, [loadData]);

  // Derived data
  const languages = useMemo(
    () => [...new Set(channels.map((ch) => ch.language))].sort(),
    [channels]
  );

  const genres = useMemo(
    () => [...new Set(channels.map((ch) => ch.genre))].sort(),
    [channels]
  );

  const languageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    channels.forEach((ch) => {
      counts[ch.language] = (counts[ch.language] || 0) + 1;
    });
    return counts;
  }, [channels]);

  const genreCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    channels.forEach((ch) => {
      counts[ch.genre] = (counts[ch.genre] || 0) + 1;
    });
    return counts;
  }, [channels]);

  // Filter and search
  const filteredChannels = useMemo(() => {
    let filtered = channels;

    if (selectedLanguages.length > 0) {
      filtered = filtered.filter((ch) =>
        selectedLanguages.includes(ch.language)
      );
    }

    if (selectedGenres.length > 0) {
      filtered = filtered.filter((ch) => selectedGenres.includes(ch.genre));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (ch) =>
          ch.channel_name.toLowerCase().includes(q) ||
          ch.channel_number.toString().includes(q)
      );
    }

    return filtered;
  }, [channels, selectedLanguages, selectedGenres, searchQuery]);

  // Group channels
  const groupedChannels = useMemo(() => {
    const groups: Record<string, Channel[]> = {};

    for (const ch of filteredChannels) {
      const key = `${ch.language} – ${ch.genre}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(ch);
    }

    // Sort channels within each group by name A-Z
    for (const key of Object.keys(groups)) {
      groups[key].sort((a, b) => a.channel_name.localeCompare(b.channel_name));
    }

    // Sort group keys
    const sorted: Record<string, Channel[]> = {};
    Object.keys(groups)
      .sort()
      .forEach((key) => {
        sorted[key] = groups[key];
      });

    return sorted;
  }, [filteredChannels]);

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handlePrint = () => {
    window.print();
  };

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
            <span className="text-[var(--foreground)]">TV Channels</span>
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-xl mx-auto mb-2">
            Search, filter, and discover{" "}
            <span className="text-[var(--accent)] font-semibold">
              {channels.length}+
            </span>{" "}
            channels across{" "}
            <span className="text-[var(--accent)] font-semibold">
              {languages.length}
            </span>{" "}
            languages on Jio STB.
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
        <section className="no-print pb-8 space-y-4">
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
