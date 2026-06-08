"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { useLanguage } from "@/components/providers/language-provider";
import { pickLocale } from "@/i18n/config";

export function Footer() {
  const { locale, t } = useLanguage();
  const name = pickLocale(siteConfig.name, locale);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:px-6">
        <p>
          © {year} {name} · {t.footer.rights}
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/accessibility"
            className="rounded text-muted underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            {t.footer.accessibility}
          </Link>
          <span aria-hidden>·</span>
          <p>
            {t.footer.builtWith} {siteConfig.builtWith}
          </p>
        </div>
      </div>
    </footer>
  );
}
