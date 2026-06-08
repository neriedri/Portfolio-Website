"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Project } from "@/types/project";
import {
  emptyProjectInput,
  projectInputSchema,
  type ProjectInput,
} from "@/lib/validation/project";
import { apiCreateProject, apiUpdateProject } from "@/lib/admin/api-client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Field } from "./field";
import { TagsInput } from "./tags-input";
import { ImageUploadField } from "./image-upload-field";
import { GalleryUploadField } from "./gallery-upload-field";
import { useToast } from "./toast";

type FormInput = z.input<typeof projectInputSchema>;

function projectToInput(p: Project): ProjectInput {
  return {
    title: p.title,
    shortDescription: p.shortDescription,
    description: p.description,
    coverImage: p.coverImage,
    images: p.images,
    githubUrl: p.githubUrl,
    liveUrl: p.liveUrl,
    tags: p.tags,
    featured: p.featured ?? false,
    order: p.order ?? 0,
    visible: p.visible,
    role: p.role,
    year: p.year,
    status: p.status,
  };
}

export function ProjectForm({
  mode,
  project,
}: {
  mode: "create" | "edit";
  project?: Project;
}) {
  const router = useRouter();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  const defaultValues = (
    project ? projectToInput(project) : emptyProjectInput
  ) as FormInput;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormInput, unknown, ProjectInput>({
    resolver: zodResolver(projectInputSchema),
    defaultValues,
  });

  async function onSubmit(values: ProjectInput) {
    setSubmitting(true);
    try {
      if (mode === "edit" && project) {
        await apiUpdateProject(project.id, values);
        toast("Project updated");
      } else {
        await apiCreateProject(values);
        toast("Project created");
      }
      router.push("/admin");
      router.refresh();
    } catch (error) {
      toast(error instanceof Error ? error.message : "Save failed", "error");
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Link
        href="/admin"
        className="text-sm text-muted transition-colors hover:text-foreground"
      >
        ← Back to projects
      </Link>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
        {mode === "edit" ? "Edit project" : "Add project"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title (Hebrew)" htmlFor="titleHe" error={errors.title?.he?.message}>
            <Input id="titleHe" dir="rtl" {...register("title.he")} />
          </Field>
          <Field label="Title (English)" htmlFor="titleEn" error={errors.title?.en?.message}>
            <Input id="titleEn" {...register("title.en")} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Short description (Hebrew)" htmlFor="shortHe" error={errors.shortDescription?.he?.message}>
            <Textarea id="shortHe" dir="rtl" rows={2} {...register("shortDescription.he")} />
          </Field>
          <Field label="Short description (English)" htmlFor="shortEn" error={errors.shortDescription?.en?.message}>
            <Textarea id="shortEn" rows={2} {...register("shortDescription.en")} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Description (Hebrew)" htmlFor="descHe" error={errors.description?.he?.message}>
            <Textarea id="descHe" dir="rtl" rows={5} {...register("description.he")} />
          </Field>
          <Field label="Description (English)" htmlFor="descEn" error={errors.description?.en?.message}>
            <Textarea id="descEn" rows={5} {...register("description.en")} />
          </Field>
        </div>

        <Field label="Cover image" error={errors.coverImage?.message}>
          <Controller
            control={control}
            name="coverImage"
            render={({ field }) => (
              <ImageUploadField
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            )}
          />
        </Field>

        <Field label="Additional images (gallery)" error={errors.images?.message}>
          <Controller
            control={control}
            name="images"
            render={({ field }) => (
              <GalleryUploadField
                value={field.value ?? []}
                onChange={field.onChange}
              />
            )}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="GitHub URL" htmlFor="githubUrl" error={errors.githubUrl?.message}>
            <Input id="githubUrl" placeholder="https://github.com/..." {...register("githubUrl")} />
          </Field>
          <Field label="Live demo URL" htmlFor="liveUrl" error={errors.liveUrl?.message}>
            <Input id="liveUrl" placeholder="https://..." {...register("liveUrl")} />
          </Field>
        </div>

        <Field label="Tags" error={errors.tags?.message}>
          <Controller
            control={control}
            name="tags"
            render={({ field }) => (
              <TagsInput value={field.value ?? []} onChange={field.onChange} />
            )}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Role" htmlFor="role">
            <Input id="role" placeholder="Solo, Lead…" {...register("role")} />
          </Field>
          <Field label="Year" htmlFor="year" error={errors.year?.message}>
            <Input id="year" type="number" inputMode="numeric" {...register("year")} />
          </Field>
          <Field label="Status" htmlFor="status">
            <Select id="status" {...register("status")}>
              <option value="">—</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In progress</option>
              <option value="archived">Archived</option>
            </Select>
          </Field>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" {...register("featured")} className="h-4 w-4 accent-[var(--accent)]" />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" {...register("visible")} className="h-4 w-4 accent-[var(--accent)]" />
            Visible
          </label>
          <Field label="Order" htmlFor="order">
            <Input id="order" type="number" inputMode="numeric" className="w-24" {...register("order")} />
          </Field>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving…" : "Save project"}
          </Button>
          <Link href="/admin" className={buttonVariants({ variant: "outline" })}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
