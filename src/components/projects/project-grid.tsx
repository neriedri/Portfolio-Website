"use client";

import type { Project } from "@/types/project";
import { ProjectCard } from "./project-card";

/** Responsive grid: 1 col mobile / 2 col tablet / 3 col desktop (PRD §5.4). */
export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <li key={project.id} className="animate-fade-in">
          {/* Prioritize the first row for LCP */}
          <ProjectCard project={project} priority={index < 3} />
        </li>
      ))}
    </ul>
  );
}
