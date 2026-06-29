import { getAllChannels } from "./channels";
import crypto from "crypto";

function computeVersion(): string {
  const channels = getAllChannels();
  const count = channels.length;
  const hash = crypto
    .createHash("md5")
    .update(JSON.stringify(channels))
    .digest("hex")
    .slice(0, 8);
  return `jio_stb_v1_${count}_${hash}`;
}

let cachedVersion: string | null = null;

export function getDataVersion(): string {
  if (!cachedVersion) {
    cachedVersion = computeVersion();
  }
  return cachedVersion;
}

export function getLastUpdated(): string {
  return "2026-06-30";
}
