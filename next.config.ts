import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep native/heavy server-only deps out of the bundle.
  serverExternalPackages: ["@prisma/client", ".prisma/client", "sharp"],
  // Baseline security headers (PRD §4.6 — Helmet equivalent). The strict
  // nonce-based Content-Security-Policy is set per-request in src/proxy.ts.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  images: {
    // Cover art for the MVP is shipped as first-party SVGs in /public/covers.
    // These are authored by us (not user uploads), so allowing SVG through the
    // image optimizer is safe here. When real raster/remote images arrive in a
    // later phase, switch to remotePatterns + WebP and drop dangerouslyAllowSVG.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Uploaded cover images live in Vercel Blob in production (absolute https
    // URLs). Local-dev uploads stay under /public/uploads and need no entry.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
