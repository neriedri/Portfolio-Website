import { PrismaClient } from "@prisma/client";

// Single PrismaClient instance. In dev, store it on globalThis so HMR doesn't
// spawn a new client (and exhaust DB connections) on every reload.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Neon's free tier suspends the database after a few idle minutes, and waking
 * it can take longer than Prisma's defaults (5s to connect, 10s to get a pooled
 * connection) — the first visitor after a quiet spell got an error page. Give
 * the cold start more room unless the URL already sets its own timeouts.
 */
function withColdStartTimeouts(url: string | undefined): string | undefined {
  if (!url) return url; // build time / local without .env: fall back to schema env()
  try {
    const parsed = new URL(url);
    if (!parsed.searchParams.has("connect_timeout")) {
      parsed.searchParams.set("connect_timeout", "15");
    }
    if (!parsed.searchParams.has("pool_timeout")) {
      parsed.searchParams.set("pool_timeout", "20");
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: withColdStartTimeouts(process.env.DATABASE_URL),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
