"use client";

import Link from "next/link";
import { useTranslations } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

const chip =
  "rounded-full border px-3 py-1 font-mono text-xs transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const active = "border-accent bg-accent text-accent-foreground tag-pulse";
const inactive =
  "border-border bg-background text-muted hover:text-foreground hover:border-foreground/30";

/**
 * Tag filter rendered as links so filtering is shareable and SSR-correct
 * (the page reads `?tag=` and filters server-side, US-12). `scroll={false}`
 * keeps the viewport on the project list when switching tags.
 */
export function TagFilter({
  tags,
  activeTag,
}: {
  tags: string[];
  activeTag: string | null;
}) {
  const t = useTranslations();

  return (
    <div
      role="group"
      aria-label={t.projects.filterLabel}
      className="flex flex-wrap gap-2"
    >
      <Link
        href="/"
        scroll={false}
        aria-current={activeTag === null ? "true" : undefined}
        className={cn(chip, activeTag === null ? active : inactive)}
      >
        {t.projects.filterAll}
      </Link>
      {tags.map((tag) => {
        const isActive = activeTag === tag;
        return (
          <Link
            key={tag}
            href={`/?tag=${encodeURIComponent(tag)}`}
            scroll={false}
            aria-current={isActive ? "true" : undefined}
            className={cn(chip, isActive ? active : inactive)}
          >
            {tag}
          </Link>
        );
      })}
    </div>
  );
}
