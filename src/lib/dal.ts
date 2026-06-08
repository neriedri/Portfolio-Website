import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession } from "./session";
import type { SessionPayload } from "./jwt";

/**
 * Authoritative auth layer (Next 16 recommended DAL pattern). Proxy only does an
 * optimistic redirect; these checks are the real gate, run close to the data.
 */

/** For admin pages: returns the session or redirects to login. Memoized per render. */
export const verifySession = cache(async (): Promise<SessionPayload> => {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
});

/** For route handlers: returns the session or null (caller responds 401). */
export async function requireAdmin(): Promise<SessionPayload | null> {
  return getSession();
}
