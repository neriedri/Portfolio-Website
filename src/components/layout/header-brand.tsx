"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/components/providers/language-provider";
import { HomeIcon } from "@/components/ui/icons";

/**
 * Left slot of the header. Intentionally empty on the home page; on any inner
 * page (e.g. a project) it shows a home icon that returns to the home screen.
 */
export function HeaderBrand() {
  const pathname = usePathname();
  const t = useTranslations();

  if (pathname === "/") return <span aria-hidden className="h-9 w-9" />;

  return (
    <Link
      href="/"
      aria-label={t.nav.home}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-colors hover:bg-foreground/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <HomeIcon />
    </Link>
  );
}
