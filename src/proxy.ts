import { NextResponse, type NextRequest } from "next/server";
import { decryptSession, SESSION_COOKIE } from "@/lib/jwt";

/**
 * Proxy (renamed from Middleware in Next 16). Two jobs:
 *  1. Set a per-request, nonce-based Content Security Policy on every page.
 *     Next auto-applies the nonce to its own scripts/styles; our inline theme
 *     script reads the same nonce in the root layout.
 *  2. Optimistic auth redirect for the /admin area (authoritative check is the
 *     DAL + route handlers).
 */

function buildCsp(nonce: string, isDev: boolean): string {
  const directives = [
    `default-src 'self'`,
    // Strict for scripts (the real XSS vector). 'unsafe-eval' only in dev (React
    // dev tooling). 'strict-dynamic' lets the nonced script load Next's bundles.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    // Pragmatic: next/image `fill` emits inline style attributes a nonce'd
    // style-src would block. Styles are a low XSS risk.
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' blob: data:`,
    `font-src 'self'`,
    `connect-src 'self'${isDev ? " ws:" : ""}`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ];
  return directives.join("; ");
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isDev = process.env.NODE_ENV === "development";
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildCsp(nonce, isDev);

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  // Optimistic auth redirect — only touch the session cookie for /admin paths.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const session = await decryptSession(req.cookies.get(SESSION_COOKIE)?.value);
    const isLoginPage = pathname === "/admin/login";
    if (!session && !isLoginPage) {
      const res = NextResponse.redirect(new URL("/admin/login", req.nextUrl));
      res.headers.set("Content-Security-Policy", csp);
      return res;
    }
    if (session && isLoginPage) {
      const res = NextResponse.redirect(new URL("/admin", req.nextUrl));
      res.headers.set("Content-Security-Policy", csp);
      return res;
    }
  }

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.headers.set("Content-Security-Policy", csp);
  return res;
}

export const config = {
  matcher: [
    {
      // Run on all pages; skip API, static assets, and prefetches.
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
