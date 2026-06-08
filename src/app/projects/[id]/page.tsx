import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectById, getProjects } from "@/lib/projects";
import { ProjectDetail } from "@/components/projects/project-detail";

/** Pre-render a page for each visible project. */
export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ id: project.id }));
}

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
