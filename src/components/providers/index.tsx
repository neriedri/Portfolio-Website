"use client";

import { ThemeProvider } from "./theme-provider";
import { LanguageProvider } from "./language-provider";

/** Wraps the app in theme + language context (client-side state). */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
}
