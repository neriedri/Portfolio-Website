import type { MetadataRoute } from "next";

// Private portfolio: keep crawlers out of the admin area (the whole site is
// also marked noindex in the root metadata).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: ["/admin", "/api/admin"],
    },
  };
}
