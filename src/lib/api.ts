import "server-only";
import { NextResponse } from "next/server";
import { requireAdmin } from "./dal";
import { isSameOrigin } from "./security";
import type { SessionPayload } from "./jwt";

export function jsonError(status: number, error: string, extra?: object) {
  return NextResponse.json({ error, ...extra }, { status });
}

/**
 * Gate an admin route handler. Returns a `Response` to return immediately
 * (403/401), or the session to continue. For mutations, also enforces the
 * same-origin (CSRF) check.
 */
export async function guardAdmin(
  req: Request,
  opts: { mutation?: boolean } = {},
): Promise<Response | SessionPayload> {
  if (opts.mutation && !isSameOrigin(req)) {
    return jsonError(403, "Forbidden");
  }
  const session = await requireAdmin();
  if (!session) return jsonError(401, "Unauthorized");
  return session;
}
