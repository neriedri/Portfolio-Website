/**
 * Fixed-window rate limiter for login (PRD §4.6: 5 attempts / 15 min).
 *
 * Two backends, chosen at runtime:
 *  - **Upstash Redis** when UPSTASH_REDIS_REST_URL/TOKEN are set — shared across
 *    all serverless invocations, so the limit actually holds on Vercel.
 *  - **In-memory Map** otherwise — fine for a single local dev server; state
 *    resets on restart and is NOT shared across instances.
 *
 * The window counts *failed* attempts; a successful login clears the key.
 */

const WINDOW_MS = 15 * 60 * 1000;
const WINDOW_SECONDS = 15 * 60;
const MAX_ATTEMPTS = 5;

import { Redis } from "@upstash/redis";

type RateLimitResult = { limited: boolean; retryAfterSeconds?: number };

// ── Upstash backend (lazy singleton) ────────────────────────────────────────
let redisClient: Redis | null | undefined;

function getRedis(): Redis | null {
  if (redisClient !== undefined) return redisClient;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  redisClient = url && token ? new Redis({ url, token }) : null;
  return redisClient;
}

const rkey = (key: string) => `ratelimit:${key}`;

// ── In-memory backend ───────────────────────────────────────────────────────
const attempts = new Map<string, { count: number; resetAt: number }>();

// ── Public API (async) ──────────────────────────────────────────────────────
export async function isRateLimited(key: string): Promise<RateLimitResult> {
  const redis = getRedis();
  if (redis) {
    const k = rkey(key);
    const count = Number((await redis.get<number>(k)) ?? 0);
    if (count >= MAX_ATTEMPTS) {
      const ttl = await redis.ttl(k); // seconds; -1/-2 if no expiry/missing
      return { limited: true, retryAfterSeconds: ttl > 0 ? ttl : WINDOW_SECONDS };
    }
    return { limited: false };
  }

  const record = attempts.get(key);
  const now = Date.now();
  if (!record || now > record.resetAt) return { limited: false };
  if (record.count >= MAX_ATTEMPTS) {
    return {
      limited: true,
      retryAfterSeconds: Math.ceil((record.resetAt - now) / 1000),
    };
  }
  return { limited: false };
}

export async function recordFailedAttempt(key: string): Promise<void> {
  const redis = getRedis();
  if (redis) {
    const k = rkey(key);
    const count = await redis.incr(k);
    if (count === 1) await redis.expire(k, WINDOW_SECONDS); // start the window
    return;
  }

  const now = Date.now();
  const record = attempts.get(key);
  if (!record || now > record.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  record.count += 1;
}

export async function clearAttempts(key: string): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.del(rkey(key));
    return;
  }
  attempts.delete(key);
}
