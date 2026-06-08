import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter, Heebo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import { themeInitScript } from "@/lib/theme-script";
import { Providers } from "@/components/providers";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Latin text uses Inter; Hebrew glyphs (absent from Inter) fall back to Heebo
// automatically per-glyph. JetBrains Mono is used for tags/code.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name.en} — Portfolio`,
    template: `%s — ${siteConfig.name.en}`,
  },
  description:
    "Personal portfolio showcasing frontend and full-stack development projects.",
  robots: { index: false, follow: false },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Nonce set by the Proxy; applied to our inline theme script so it survives
  // the strict CSP. Next applies the same nonce to its own scripts automatically.
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    // Default locale is Hebrew (RTL); the init script reconciles with the
    // visitor's stored preference before paint. suppressHydrationWarning lets
    // that script mutate <html> without a hydration mismatch warning.
    <html
      lang="he"
      dir="rtl"
      suppressHydrationWarning
      className={`${inter.variable} ${heebo.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          nonce={nonce}
          // Browsers blank the nonce attribute after applying it, so the
          // hydrated DOM differs from what React rendered — expected, suppress it.
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
