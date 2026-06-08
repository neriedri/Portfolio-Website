import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { getAnyProjectById } from "@/lib/admin/projects";
import { ProjectForm } from "@/components/admin/project-form";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await verifySession();
  const { id } = await params;
  const project = await getAnyProjectById(id);
  if (!project) notFound();
  return <ProjectForm mode="edit" project={project} />;
}
