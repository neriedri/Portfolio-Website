"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/types/project";
import { apiDeleteProject, apiSetVisibility } from "@/lib/admin/api-client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "./toast";

export function ProjectsTable({ projects: initial }: { projects: Project[] }) {
  const [projects, setProjects] = useState(initial);
  const [busyId, setBusyId] = useState<string | null>(null);
  const router = useRouter();
  const toast = useToast();

  async function toggleVisible(project: Project) {
    setBusyId(project.id);
    try {
      const updated = await apiSetVisibility(project.id, !project.visible);
      setProjects((prev) => prev.map((p) => (p.id === project.id ? updated : p)));
      toast(updated.visible ? "Project is now visible" : "Project hidden");
      router.refresh();
    } catch (error) {
      toast(error instanceof Error ? error.message : "Update failed", "error");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(project: Project) {
    if (!confirm(`Delete "${project.title.en}"? This cannot be undone.`)) return;
    setBusyId(project.id);
    try {
      await apiDeleteProject(project.id);
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      toast("Project deleted");
      router.refresh();
    } catch (error) {
      toast(error instanceof Error ? error.message : "Delete failed", "error");
    } finally {
      setBusyId(null);
    }
  }

  if (projects.length === 0) {
    return (
      <p className="mt-8 text-muted">No projects yet. Add your first one.</p>
    );
  }

  return (
    <ul className="mt-6 divide-y divide-border overflow-hidden rounded-xl border border-border">
      {projects.map((project) => (
        <li
          key={project.id}
          className="flex flex-wrap items-center gap-4 bg-surface p-3"
        >
          <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-md bg-foreground/[0.04]">
            <Image
              src={project.coverImage}
              alt=""
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-foreground">
              {project.title.en}
            </p>
            <p className="truncate text-xs text-muted">
              {project.tags.join(" · ")}
            </p>
          </div>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 font-mono text-xs",
              project.visible
                ? "bg-accent/10 text-accent"
                : "bg-foreground/[0.06] text-muted",
            )}
          >
            {project.visible ? "Visible" : "Hidden"}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleVisible(project)}
              disabled={busyId === project.id}
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              {project.visible ? "Hide" : "Show"}
            </button>
            <Link
              href={`/admin/projects/${project.id}/edit`}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={() => remove(project)}
              disabled={busyId === project.id}
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
                className: "text-red-500",
              })}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
