import { NextResponse } from "next/server";
import { getDataVersion, getLastUpdated } from "@/lib/version";
import { getAllChannels } from "@/lib/channels";

export async function GET() {
  const channels = getAllChannels();
  return NextResponse.json(
    {
      version: getDataVersion(),
      channels: channels.length,
      lastUpdated: getLastUpdated(),
      platform: "jio_stb",
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
