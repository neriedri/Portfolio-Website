import "server-only";
import type { Project } from "@/types/project";
import { prisma } from "./db";
import { toProject } from "./mappers";

/**
 * Public data-access layer. Same function signatures the MVP shipped with —
 * now backed by Postgres via Prisma instead of mock data. This is the only file
 * that changed when the database landed; pages and components are untouched.
 */

/** Public list: visible projects only, sorted by display order. */
export async function getProjects(): Promise<Project[]> {
  const rows = await prisma.project.findMany({
    where: { visible: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return rows.map(toProject);
}

/** A single visible project by id, or null if missing/hidden. */
export async function getProjectById(id: string): Promise<Project | null> {
  const row = await prisma.project.findFirst({
    where: { id, visible: true },
  });
  return row ? toProject(row) : null;
}

/** Distinct tags across visible projects, alphabetically sorted. */
export async function getAllTags(): Promise<string[]> {
  const rows = await prisma.project.findMany({
    where: { visible: true },
    select: { tags: true },
  });
  const tags = new Set<string>();
  for (const row of rows) {
    for (const tag of row.tags) tags.add(tag);
  }
  return Array.from(tags).sort((a, b) => a.localeCompare(b));
}
