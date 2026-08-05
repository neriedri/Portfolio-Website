"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types/project";
import { useLanguage } from "@/components/providers/language-provider";
import { pickLocale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { CoverImage } from "./cover-image";
import { LiveBadge } from "./live-badge";
import { Tag } from "@/components/ui/tag";
import { buttonVariants } from "@/components/ui/button";
import {
  ArrowLeftIcon,
  ExternalLinkIcon,
  GitHubIcon,
} from "@/components/ui/icons";

export function ProjectDetail({ project }: { project: Project }) {
  const { locale, t } = useLanguage();

  const title = pickLocale(project.title, locale);
  const description = pickLocale(project.description, locale);
  const paragraphs = description.split("\n\n");

  // Cover first, then extra gallery images (deduped). Clicking a thumb swaps the hero.
  const gallery = Array.from(new Set([project.coverImage, ...project.images]));
  const [active, setActive] = useState(0);
  const activeSrc = gallery[Math.min(active, gallery.length - 1)];

  const meta: { label: string; value: string }[] = [];
  if (project.role) meta.push({ label: t.detail.role, value: project.role });
  if (project.year)
    meta.push({ label: t.detail.year, value: String(project.year) });
  if (project.status)
    meta.push({
      label: t.detail.status,
      value: t.detail.statusValues[project.status],
    });

  return (
    <article className="animate-fade-in py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-md text-sm text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {/* Arrow points toward the start; flip in RTL */}
        <ArrowLeftIcon className="rtl:rotate-180" />
        {t.detail.back}
      </Link>

      <div className="relative mt-6 overflow-hidden rounded-2xl border border-border">
        <CoverImage
          src={activeSrc}
          alt={title}
          sizes="(max-width: 1024px) 100vw, 1024px"
          priority
          className="aspect-[16/8]"
        />
        {project.status === "completed" && (
          <LiveBadge variant={project.liveUrl ? "live" : "done"} />
        )}
        {project.status === "in-progress" && <LiveBadge variant="dev" />}
      </div>

      {gallery.length > 1 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {gallery.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`${t.detail.image} ${i + 1}`}
                aria-current={i === active}
                className={cn(
                  "relative block h-16 w-24 overflow-hidden rounded-lg border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  i === active
                    ? "border-accent ring-1 ring-accent"
                    : "border-border opacity-70 hover:opacity-100",
                )}
              >
                <Image src={src} alt="" fill sizes="96px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <header className="mt-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li key={tag}>
              <Tag>{tag}</Tag>
            </li>
          ))}
        </ul>

        {(project.githubUrl || project.liveUrl) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "primary", size: "sm" })}
              >
                <GitHubIcon />
                {t.detail.viewOnGithub}
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                <ExternalLinkIcon />
                {t.detail.liveDemo}
              </a>
            )}
          </div>
        )}
      </header>

      {meta.length > 0 && (
        <dl className="mt-8 grid grid-cols-2 gap-4 rounded-xl border border-border bg-surface p-5 sm:grid-cols-3">
          {meta.map((item) => (
            <div key={item.label}>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                {item.label}
              </dt>
              <dd className="mt-1 text-sm text-foreground">{item.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <hr className="my-8 border-border" />

      <section>
        <h2 className="text-xl font-semibold text-foreground">
          {t.detail.aboutHeading}
        </h2>
        <div className="mt-4 space-y-4 leading-relaxed text-muted">
          {paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-foreground">
          {t.detail.techHeading}
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li key={tag}>
              <Tag>{tag}</Tag>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
