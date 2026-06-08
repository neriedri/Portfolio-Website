import { NextResponse } from "next/server";
import { guardAdmin, jsonError } from "@/lib/api";
import { createProject, listAllProjects } from "@/lib/admin/projects";
import { projectInputSchema } from "@/lib/validation/project";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const guard = await guardAdmin(req);
  if (guard instanceof Response) return guard;

  const projects = await listAllProjects();
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const guard = await guardAdmin(req, { mutation: true });
  if (guard instanceof Response) return guard;

  const body = await req.json().catch(() => null);
  const parsed = projectInputSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(422, "Validation failed", {
      issues: parsed.error.flatten(),
    });
  }

  const project = await createProject(parsed.data);
  return NextResponse.json(project, { status: 201 });
}
