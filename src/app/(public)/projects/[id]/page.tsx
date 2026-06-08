import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/projects";
import { ProjectDetail } from "@/components/projects/project-detail";

// Render at request time so admin edits appear immediately (DB-backed).
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) return {};
  return {
    title: project.title.en,
    description: project.shortDescription.en,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) notFound();

  return <ProjectDetail project={project} />;
}
