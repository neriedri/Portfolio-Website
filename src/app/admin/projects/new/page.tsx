import { verifySession } from "@/lib/dal";
import { ProjectForm } from "@/components/admin/project-form";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  await verifySession();
  return <ProjectForm mode="create" />;
}
