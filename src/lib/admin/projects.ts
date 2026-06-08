import "server-only";
import type { Project } from "@/types/project";
import { prisma } from "../db";
import { toProject, toDbStatus } from "../mappers";
import type { ProjectInput } from "../validation/project";

/** Map validated form input to Prisma column data. */
function toDbData(input: ProjectInput) {
  return {
    titleHe: input.title.he,
    titleEn: input.title.en,
    descriptionHe: input.description.he,
    descriptionEn: input.description.en,
    shortDescriptionHe: input.shortDescription.he,
    shortDescriptionEn: input.shortDescription.en,
    coverImage: input.coverImage,
    images: input.images,
    githubUrl: input.githubUrl ?? null,
    liveUrl: input.liveUrl ?? null,
    tags: input.tags,
    featured: input.featured,
    order: input.order,
    visible: input.visible,
    role: input.role ?? null,
    year: input.year ?? null,
    status: input.status ? toDbStatus(input.status) : null,
  };
}

/** All projects including hidden (admin only). */
export async function listAllProjects(): Promise<Project[]> {
  const rows = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return rows.map(toProject);
}

/** Any project by id, including hidden (admin only). */
export async function getAnyProjectById(id: string): Promise<Project | null> {
  const row = await prisma.project.findUnique({ where: { id } });
  return row ? toProject(row) : null;
}

export async function createProject(input: ProjectInput): Promise<Project> {
  const row = await prisma.project.create({ data: toDbData(input) });
  return toProject(row);
}

export async function updateProject(
  id: string,
  input: ProjectInput,
): Promise<Project> {
  const row = await prisma.project.update({
    where: { id },
    data: toDbData(input),
  });
  return toProject(row);
}

export async function deleteProject(id: string): Promise<void> {
  await prisma.project.delete({ where: { id } });
}

export async function setVisibility(
  id: string,
  visible: boolean,
): Promise<Project> {
  const row = await prisma.project.update({
    where: { id },
    data: { visible },
  });
  return toProject(row);
}
