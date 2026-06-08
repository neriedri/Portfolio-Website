import type { Metadata } from "next";
import { Inter, Heebo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import { themeInitScript } from "@/lib/theme-script";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SkipLink } from "@/components/layout/skip-link";

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
  title: {
    default: `${siteConfig.name} — Portfolio`,
    template: `%s — ${siteConfig.name}`,
  },
  description:
    "Personal portfolio showcasing frontend and full-stack development projects.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <Providers>
          <SkipLink />
          <Header />
          <main id="main-content" className="flex-1">
            <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
              {children}
            </div>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
