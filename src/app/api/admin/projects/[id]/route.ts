import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { guardAdmin, jsonError } from "@/lib/api";
import {
  deleteProject,
  setVisibility,
  updateProject,
} from "@/lib/admin/projects";
import { projectInputSchema } from "@/lib/validation/project";

export const dynamic = "force-dynamic";

function isNotFound(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  );
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await guardAdmin(req, { mutation: true });
  if (guard instanceof Response) return guard;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = projectInputSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(422, "Validation failed", {
      issues: parsed.error.flatten(),
    });
  }

  try {
    const project = await updateProject(id, parsed.data);
    return NextResponse.json(project);
  } catch (error) {
    if (isNotFound(error)) return jsonError(404, "Project not found");
    throw error;
  }
}

const patchSchema = z.object({ visible: z.boolean() });

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await guardAdmin(req, { mutation: true });
  if (guard instanceof Response) return guard;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return jsonError(422, "Validation failed");

  try {
    const project = await setVisibility(id, parsed.data.visible);
    return NextResponse.json(project);
  } catch (error) {
    if (isNotFound(error)) return jsonError(404, "Project not found");
    throw error;
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await guardAdmin(req, { mutation: true });
  if (guard instanceof Response) return guard;

  const { id } = await params;
  try {
    await deleteProject(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isNotFound(error)) return jsonError(404, "Project not found");
    throw error;
  }
}
