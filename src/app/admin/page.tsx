import Link from "next/link";
import { verifySession } from "@/lib/dal";
import { listAllProjects } from "@/lib/admin/projects";
import { ProjectsTable } from "@/components/admin/projects-table";
import { LogoutButton } from "@/components/admin/logout-button";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await verifySession();
  const projects = await listAllProjects();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Projects
        </h1>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/projects/new"
            className={buttonVariants({ size: "sm" })}
          >
            + Add New
          </Link>
          <LogoutButton />
        </div>
      </div>
      <ProjectsTable projects={projects} />
    </div>
  );
}
