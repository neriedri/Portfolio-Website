"use client";

import { siteConfig } from "@/lib/site-config";
import { useTranslations } from "@/components/providers/language-provider";

export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:px-6">
        <p>
          © {year} {siteConfig.name} · {t.footer.rights}
        </p>
        <p>
          {t.footer.builtWith} {siteConfig.builtWith}
        </p>
      </div>
    </footer>
  );
}
