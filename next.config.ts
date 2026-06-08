import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cover art for the MVP is shipped as first-party SVGs in /public/covers.
    // These are authored by us (not user uploads), so allowing SVG through the
    // image optimizer is safe here. When real raster/remote images arrive in a
    // later phase, switch to remotePatterns + WebP and drop dangerouslyAllowSVG.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
