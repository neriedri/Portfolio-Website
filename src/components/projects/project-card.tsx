"use client";

import Link from "next/link";
import type { Project } from "@/types/project";
import { useLanguage } from "@/components/providers/language-provider";
import { pickLocale } from "@/i18n/config";
import { CoverImage } from "./cover-image";
import { Tag } from "@/components/ui/tag";

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

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition duration-200 group-hover:scale-[1.02] group-hover:shadow-lg">
        <CoverImage
          src={project.coverImage}
          alt={title}
          sizes={CARD_SIZES}
          priority={priority}
          className="aspect-[16/10]"
        />
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground">{title}</h3>
            {project.featured && <Tag active>{t.projects.featured}</Tag>}
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
