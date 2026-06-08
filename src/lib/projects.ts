import type { Project } from "@/types/project";
import { mockProjects } from "./mock-data";

/**
 * Data-access layer (the single swap point for the future backend).
 *
 * The MVP reads from `mockProjects`, but every function is async and returns
 * the same shapes a real API/DB would. When the backend phase lands, only this
 * file changes — pages and components keep importing from here untouched.
 */

const byOrder = (a: Project, b: Project) =>
  (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER);

/** Public list: visible projects only, sorted by display order. */
export async function getProjects(): Promise<Project[]> {
  return mockProjects.filter((p) => p.visible).sort(byOrder);
}

/** A single visible project by id, or null if missing/hidden. */
export async function getProjectById(id: string): Promise<Project | null> {
  const project = mockProjects.find((p) => p.id === id && p.visible);
  return project ?? null;
}

/** Distinct tags across visible projects, alphabetically sorted. */
export async function getAllTags(): Promise<string[]> {
  const visible = mockProjects.filter((p) => p.visible);
  const tags = new Set<string>();
  for (const project of visible) {
    for (const tag of project.tags) tags.add(tag);
  }
  return Array.from(tags).sort((a, b) => a.localeCompare(b));
}
