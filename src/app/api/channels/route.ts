import { NextRequest, NextResponse } from "next/server";
import {
  getAllChannels,
  searchChannels,
  filterChannels,
  sortChannels,
  groupChannels,
  paginateChannels,
} from "@/lib/channels";
import { getDataVersion, getLastUpdated } from "@/lib/version";
import { checkRateLimit } from "@/lib/ratelimit";

export async function GET(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
  const rateLimitResult = await checkRateLimit(ip);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many requests. Please try again later.",
        retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": rateLimitResult.limit.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": rateLimitResult.reset.toString(),
          "Retry-After": Math.ceil(
            (rateLimitResult.reset - Date.now()) / 1000
          ).toString(),
        },
      }
    );
  }

  // Parse query parameters
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const language = searchParams.get("language") || "";
  const genre = searchParams.get("genre") || "";
  const sort = searchParams.get("sort") || "number";
  const order = searchParams.get("order") || "asc";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "50", 10);
  const group_by = searchParams.get("group_by") || "";

  // Pipeline: get all → search → filter → sort
  let data = getAllChannels();
  data = searchChannels(search, data);
  data = filterChannels(data, language || undefined, genre || undefined);
  data = sortChannels(data, sort, order);

  // Grouped response
  if (group_by) {
    const grouped = groupChannels(data, group_by);
    return NextResponse.json(
      {
        success: true,
        data: grouped,
        total: data.length,
        groups: Object.keys(grouped).length,
        meta: {
          platform: "jio_stb",
          version: getDataVersion(),
          lastUpdated: getLastUpdated(),
        },
      },
      {
        headers: {
          "X-RateLimit-Limit": rateLimitResult.limit.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  }

  // Paginated response
  const paginated = paginateChannels(data, page, limit);

  return NextResponse.json(
    {
      success: true,
      data: paginated.data,
      pagination: {
        page,
        limit: Math.min(Math.max(1, limit), 200),
        total: paginated.total,
        totalPages: paginated.totalPages,
      },
      meta: {
        platform: "jio_stb",
        version: getDataVersion(),
        lastUpdated: getLastUpdated(),
      },
    },
    {
      headers: {
        "X-RateLimit-Limit": rateLimitResult.limit.toString(),
        "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
