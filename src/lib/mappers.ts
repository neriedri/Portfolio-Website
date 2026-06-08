import type { Project as PrismaProject, ProjectStatus as PrismaStatus } from "@prisma/client";
import type { Project, ProjectStatus } from "@/types/project";

// DB enums can't contain hyphens, so "in-progress" is stored as "in_progress".
// These helpers translate between the DB enum and the app's hyphenated union.
export function fromDbStatus(status: PrismaStatus): ProjectStatus {
  return status.replace("_", "-") as ProjectStatus;
}

export function toDbStatus(status: ProjectStatus): PrismaStatus {
  return status.replace("-", "_") as PrismaStatus;
}

/** Convert a Prisma row into the app's `Project` shape (bilingual objects). */
export function toProject(row: PrismaProject): Project {
  return {
    id: row.id,
    title: { he: row.titleHe, en: row.titleEn },
    description: { he: row.descriptionHe, en: row.descriptionEn },
    shortDescription: { he: row.shortDescriptionHe, en: row.shortDescriptionEn },
    coverImage: row.coverImage,
    images: row.images,
    githubUrl: row.githubUrl ?? undefined,
    liveUrl: row.liveUrl ?? undefined,
    tags: row.tags,
    featured: row.featured,
    order: row.order,
    visible: row.visible,
    role: row.role ?? undefined,
    year: row.year ?? undefined,
    status: row.status ? fromDbStatus(row.status) : undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
