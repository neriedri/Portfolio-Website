"use client";

import { useTranslations } from "@/components/providers/language-provider";

/** Keyboard skip-to-content link (PRD §4.7). Hidden until focused. */
export function SkipLink() {
  const t = useTranslations();
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-accent-foreground"
    >
      {t.nav.skipToContent}
    </a>
  );
}
