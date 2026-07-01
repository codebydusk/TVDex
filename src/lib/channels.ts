import type { Channel } from "@/types";

export type { Channel, ChannelGroup, PaginatedResponse } from "@/types";

import channelData from "../../assets/jio_stb_channels.json";

const channels: Channel[] = channelData as Channel[];

export function getAllChannels(): Channel[] {
  return channels;
}

export function searchChannels(query: string, data: Channel[] = channels): Channel[] {
  const q = query.toLowerCase().trim();
  if (!q) return data;

  return data.filter(
    (ch) =>
      ch.channel_name.toLowerCase().includes(q) ||
      ch.channel_number.toString().includes(q)
  );
}

export function filterChannels(
  data: Channel[],
  language?: string | string[],
  genre?: string | string[]
): Channel[] {
  let filtered = data;

  if (language) {
    const langs = Array.isArray(language) ? language : language.split(",").map((l) => l.trim());
    if (langs.length > 0 && langs[0] !== "") {
      filtered = filtered.filter((ch) =>
        langs.some((l) => ch.language.toLowerCase() === l.toLowerCase())
      );
    }
  }

  if (genre) {
    const genres = Array.isArray(genre) ? genre : genre.split(",").map((g) => g.trim());
    if (genres.length > 0 && genres[0] !== "") {
      filtered = filtered.filter((ch) =>
        genres.some((g) => ch.genre.toLowerCase() === g.toLowerCase())
      );
    }
  }

  return filtered;
}

export function sortChannels(
  data: Channel[],
  sortBy: string = "number",
  order: string = "asc"
): Channel[] {
  const sorted = [...data];
  const dir = order === "desc" ? -1 : 1;

  sorted.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return dir * a.channel_name.localeCompare(b.channel_name);
      case "number":
        return dir * (a.channel_number - b.channel_number);
      case "genre":
        return dir * a.genre.localeCompare(b.genre);
      case "language":
        return dir * a.language.localeCompare(b.language);
      default:
        return dir * (a.channel_number - b.channel_number);
    }
  });

  return sorted;
}

export function groupChannels(
  data: Channel[],
  groupBy: string = "language_genre"
): Record<string, Channel[]> {
  const groups: Record<string, Channel[]> = {};

  for (const ch of data) {
    let key: string;
    switch (groupBy) {
      case "language":
        key = ch.language;
        break;
      case "genre":
        key = ch.genre;
        break;
      case "language_genre":
      default:
        key = `${ch.language} – ${ch.genre}`;
        break;
    }

    if (!groups[key]) groups[key] = [];
    groups[key].push(ch);
  }

  // Sort channels within each group by name A-Z
  for (const key of Object.keys(groups)) {
    groups[key].sort((a, b) => a.channel_name.localeCompare(b.channel_name));
  }

  return groups;
}

export function paginateChannels(
  data: Channel[],
  page: number = 1,
  limit: number = 50
): { data: Channel[]; total: number; totalPages: number } {
  const safeLimit = Math.min(Math.max(1, limit), 200);
  const safePage = Math.max(1, page);
  const total = data.length;
  const totalPages = Math.ceil(total / safeLimit);
  const start = (safePage - 1) * safeLimit;
  const end = start + safeLimit;

  return {
    data: data.slice(start, end),
    total,
    totalPages,
  };
}

export function getLanguages(): string[] {
  return [...new Set(channels.map((ch) => ch.language))].sort();
}

export function getGenres(): string[] {
  return [...new Set(channels.map((ch) => ch.genre))].sort();
}
