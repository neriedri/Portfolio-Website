/**
 * CSRF defense for state-changing admin routes. Combined with the
 * SameSite=Strict session cookie, verifying that the request's Origin (or
 * Referer) matches the Host blocks cross-site forged requests. Browsers always
 * send Origin on unsafe methods (POST/PUT/DELETE).
 */
export function isSameOrigin(req: Request): boolean {
  const host = req.headers.get("host");
  if (!host) return false;

  const origin = req.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }

  const referer = req.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).host === host;
    } catch {
      return false;
    }
  }

  // No Origin/Referer on a mutation → reject.
  return false;
}
