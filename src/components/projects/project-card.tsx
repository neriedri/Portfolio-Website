"use client";

import Link from "next/link";
import type { Project } from "@/types/project";
import { useLanguage } from "@/components/providers/language-provider";
import { pickLocale } from "@/i18n/config";
import { ProjectCover } from "./project-cover";
import { LiveBadge } from "./live-badge";
import { Tag } from "@/components/ui/tag";
import { StarIcon } from "@/components/ui/icons";

const CARD_SIZES =
  "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

export function ProjectCard({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  const { locale, t } = useLanguage();
  const title = pickLocale(project.title, locale);
  const summary = pickLocale(project.shortDescription, locale);
  // Cover first, then any extra gallery images (deduped) — drives the slideshow.
  const slides = Array.from(new Set([project.coverImage, ...project.images]));

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <article className="project-card flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <div className="relative">
          <ProjectCover
            images={slides}
            alt={title}
            sizes={CARD_SIZES}
            priority={priority}
            className="aspect-[16/10]"
          />
          {project.status === "completed" && (
            <LiveBadge variant={project.liveUrl ? "live" : "done"} />
          )}
          {project.status === "in-progress" && <LiveBadge variant="dev" />}
          {/* Floating CTA revealed on hover / keyboard focus of the card. */}
          <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            <span className="mb-4 inline-flex translate-y-2 items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground shadow-lg transition-transform duration-300 group-hover:translate-y-0 group-focus-visible:translate-y-0">
              {t.projects.viewProject}
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground">{title}</h3>
            {project.featured && (
              <span
                title={t.projects.featured}
                aria-label={t.projects.featured}
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent p-1.5 text-accent-foreground shadow-sm"
              >
                <StarIcon width={14} height={14} />
              </span>
            )}
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-muted">{summary}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.tags.slice(0, 4).map((tag) => (
              <li key={tag}>
                <Tag>{tag}</Tag>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </Link>
  );
}
