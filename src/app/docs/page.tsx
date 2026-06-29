"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ParamDoc {
  name: string;
  type: string;
  description: string;
  example: string;
}

const API_PARAMS: ParamDoc[] = [
  { name: "search", type: "string", description: "Search by channel name or number", example: "cartoon" },
  { name: "language", type: "string", description: "Filter by language (comma-separated)", example: "Telugu,Hindi" },
  { name: "genre", type: "string", description: "Filter by genre (comma-separated)", example: "News,Sports" },
  { name: "sort", type: "string", description: "Sort field: name, number, genre, language", example: "name" },
  { name: "order", type: "string", description: "Sort order: asc or desc", example: "asc" },
  { name: "page", type: "number", description: "Page number (1-based)", example: "1" },
  { name: "limit", type: "number", description: "Items per page (1-200, default: 50)", example: "25" },
  { name: "group_by", type: "string", description: "Group results: language, genre, or language_genre", example: "language" },
];

const EXAMPLES = [
  {
    title: "Get all channels",
    description: "Returns the first 50 channels sorted by channel number.",
    url: "/api/channels",
    response: `{
  "success": true,
  "data": [
    {
      "id": "f35ea4e3-...",
      "channel_number": 104,
      "channel_name": "&xplorHD",
      "genre": "Entertainment",
      "language": "Hindi"
    },
    ...
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 816,
    "totalPages": 17
  },
  "meta": {
    "platform": "jio_stb",
    "version": "jio_stb_v1_816_abc123",
    "lastUpdated": "2026-06-30"
  }
}`,
  },
  {
    title: "Search for Cartoon Network",
    description: "Find channels matching 'cartoon' in name or number.",
    url: "/api/channels?search=cartoon",
    response: `{
  "success": true,
  "data": [
    {
      "id": "...",
      "channel_number": 667,
      "channel_name": "Cartoon Network",
      "genre": "Kids",
      "language": "Hindi"
    }
  ],
  "pagination": {
    "page": 1, "limit": 50, "total": 1, "totalPages": 1
  },
  ...
}`,
  },
  {
    title: "Telugu News channels",
    description: "Filter by language and genre, sorted alphabetically.",
    url: "/api/channels?language=Telugu&genre=News&sort=name",
    response: `{
  "success": true,
  "data": [
    { "channel_name": "10 TV", "channel_number": 1467, ... },
    { "channel_name": "ABN Andhra Jyothi", "channel_number": 1421, ... },
    ...
  ],
  "pagination": { "page": 1, "limit": 50, "total": 23, "totalPages": 1 },
  ...
}`,
  },
  {
    title: "Group by language",
    description: "Get all channels grouped by their language.",
    url: "/api/channels?group_by=language",
    response: `{
  "success": true,
  "data": {
    "Hindi": [ ... ],
    "English": [ ... ],
    "Telugu": [ ... ],
    ...
  },
  "total": 816,
  "groups": 12,
  ...
}`,
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 rounded-md bg-[var(--card-hover)] px-2 py-1 text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

export default function DocsPage() {
  const [activeExample, setActiveExample] = useState(0);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://tvdex.vercel.app";

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-glow)] px-4 py-1.5 text-sm font-medium text-[var(--accent)] mb-4">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            REST API
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">
            <span className="gradient-text">TVDex</span>{" "}
            <span className="text-[var(--foreground)]">API Documentation</span>
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
            A free, public REST API to query Jio STB channel data. Search,
            filter, sort, paginate, and group 800+ channels programmatically.
          </p>
        </div>

        {/* Base URL */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">Base URL</h2>
          <div className="relative rounded-xl bg-[var(--card)] border border-[var(--border)] p-4">
            <code className="text-sm font-mono text-[var(--accent)]">
              GET {baseUrl}/api/channels
            </code>
            <CopyButton text={`${baseUrl}/api/channels`} />
          </div>
        </section>

        {/* Rate Limiting */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">Rate Limiting</h2>
          <div className="rounded-xl bg-[var(--card)] border border-[var(--border)] p-4 space-y-2">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-[var(--foreground)] font-medium">
                  10 requests per minute per IP address
                </p>
                <p className="text-sm text-[var(--muted)] mt-1">
                  Exceeding this limit returns a <code className="text-xs bg-[var(--card-hover)] px-1.5 py-0.5 rounded font-mono">429 Too Many Requests</code> response.
                  Rate limit headers (<code className="text-xs bg-[var(--card-hover)] px-1.5 py-0.5 rounded font-mono">X-RateLimit-*</code>) are included in every response.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Query Parameters */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">Query Parameters</h2>
          <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--card)] border-b border-[var(--border)]">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                    Parameter
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                    Example
                  </th>
                </tr>
              </thead>
              <tbody>
                {API_PARAMS.map((param, i) => (
                  <tr
                    key={param.name}
                    className={`border-b border-[var(--border)] ${i % 2 === 0 ? "" : "bg-[var(--card)]/30"}`}
                  >
                    <td className="px-4 py-3">
                      <code className="text-sm font-mono text-[var(--accent)]">
                        {param.name}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--muted)]">
                      {param.type}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--foreground)]">
                      {param.description}
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono bg-[var(--card-hover)] px-2 py-1 rounded text-[var(--foreground)]">
                        {param.example}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Examples */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">Examples</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => setActiveExample(i)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all cursor-pointer ${
                  activeExample === i
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--card)] text-[var(--muted)] border border-[var(--border)] hover:text-[var(--foreground)]"
                }`}
              >
                {ex.title}
              </button>
            ))}
          </div>

          <div className="space-y-4 animate-fade-in" key={activeExample}>
            <p className="text-sm text-[var(--muted)]">
              {EXAMPLES[activeExample].description}
            </p>

            {/* Request */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
                Request
              </h4>
              <div className="relative rounded-xl bg-[var(--card)] border border-[var(--border)] p-4">
                <code className="text-sm font-mono text-[var(--accent)] break-all">
                  GET {baseUrl}{EXAMPLES[activeExample].url}
                </code>
                <CopyButton text={`${baseUrl}${EXAMPLES[activeExample].url}`} />
              </div>
            </div>

            {/* cURL */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
                cURL
              </h4>
              <div className="relative rounded-xl bg-[var(--card)] border border-[var(--border)] p-4">
                <code className="text-sm font-mono text-green-400 break-all">
                  curl &quot;{baseUrl}{EXAMPLES[activeExample].url}&quot;
                </code>
                <CopyButton text={`curl "${baseUrl}${EXAMPLES[activeExample].url}"`} />
              </div>
            </div>

            {/* Response */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
                Response
              </h4>
              <div className="relative rounded-xl bg-[var(--card)] border border-[var(--border)] p-4 overflow-x-auto">
                <pre className="text-sm font-mono text-[var(--foreground)] whitespace-pre">
                  {EXAMPLES[activeExample].response}
                </pre>
                <CopyButton text={EXAMPLES[activeExample].response} />
              </div>
            </div>
          </div>
        </section>

        {/* Version endpoint */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">Version Endpoint</h2>
          <p className="text-sm text-[var(--muted)] mb-3">
            Use this endpoint to check if the channel data has been updated since you last fetched it.
          </p>
          <div className="relative rounded-xl bg-[var(--card)] border border-[var(--border)] p-4">
            <code className="text-sm font-mono text-[var(--accent)]">
              GET {baseUrl}/api/version
            </code>
            <CopyButton text={`${baseUrl}/api/version`} />
          </div>
          <div className="relative rounded-xl bg-[var(--card)] border border-[var(--border)] p-4 mt-3">
            <pre className="text-sm font-mono text-[var(--foreground)]">{`{
  "version": "jio_stb_v1_816_abc123",
  "channels": 816,
  "lastUpdated": "2026-06-30",
  "platform": "jio_stb"
}`}</pre>
          </div>
        </section>

        {/* Error Responses */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">Error Responses</h2>
          <div className="rounded-xl bg-[var(--card)] border border-[var(--border)] p-4 space-y-3">
            <div className="flex items-center gap-3">
              <code className="shrink-0 rounded-md bg-red-500/20 px-2 py-1 text-xs font-mono text-red-400">
                429
              </code>
              <span className="text-sm text-[var(--foreground)]">
                Too Many Requests — You have exceeded the rate limit of 10 requests per minute.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <code className="shrink-0 rounded-md bg-red-500/20 px-2 py-1 text-xs font-mono text-red-400">
                500
              </code>
              <span className="text-sm text-[var(--foreground)]">
                Internal Server Error — Something went wrong on our end.
              </span>
            </div>
          </div>
        </section>

        {/* Platforms Note */}
        <section className="rounded-xl bg-gradient-to-r from-[var(--accent-glow)] to-transparent border border-[var(--accent)]/20 p-6">
          <h3 className="font-bold text-lg mb-2">🚀 More Platforms Coming Soon</h3>
          <p className="text-sm text-[var(--muted)]">
            We are working on adding channel data for Airtel DTH, Tata Play,
            Dish TV, and more. The API structure will remain the same — just swap
            the <code className="bg-[var(--card-hover)] px-1.5 py-0.5 rounded font-mono text-xs">platform</code> parameter.
            Want to help? Check out our{" "}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:text-[var(--accent-hover)] underline"
            >
              contribution guide
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
