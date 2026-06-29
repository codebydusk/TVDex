import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  if (ratelimit) return ratelimit;

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return null;
  }

  try {
    const redis = new Redis({ url, token });
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "60 s"),
      analytics: true,
      prefix: "tvdex_api",
    });
    return ratelimit;
  } catch {
    return null;
  }
}

export async function checkRateLimit(
  identifier: string
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const rl = getRatelimit();

  if (!rl) {
    // No Redis configured — allow all requests (dev mode)
    return { success: true, limit: 10, remaining: 10, reset: 0 };
  }

  try {
    const result = await rl.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch {
    // Redis error — fail open
    return { success: true, limit: 10, remaining: 10, reset: 0 };
  }
}
