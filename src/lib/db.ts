import { PrismaClient } from "@prisma/client";

// Single PrismaClient instance. In dev, store it on globalThis so HMR doesn't
// spawn a new client (and exhaust DB connections) on every reload.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
