"use client";

import type { Project } from "@/types/project";
import { useTranslations } from "@/components/providers/language-provider";
import { ProjectGrid } from "./project-grid";
import { TagFilter } from "./tag-filter";
import { EmptyState } from "./empty-state";

/**
 * Projects section: heading + tag filter + grid (or empty state). Receives the
 * already-filtered list from the server page, so it stays purely presentational.
 */
export function ProjectsBrowser({
  projects,
  tags,
  activeTag,
}: {
  projects: Project[];
  tags: string[];
  activeTag: string | null;
}) {
  const t = useTranslations();

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="scroll-mt-20"
    >
      <div className="mb-8">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          {t.projects.tagsHeading}
        </h3>
        <TagFilter tags={tags} activeTag={activeTag} />
      </div>
      <h2
        id="projects-heading"
        className="mb-8 text-center text-2xl font-semibold tracking-tight text-foreground"
      >
        {t.projects.heading}
      </h2>
      {projects.length > 0 ? (
        <ProjectGrid projects={projects} />
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
