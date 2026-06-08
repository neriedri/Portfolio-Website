"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { apiUploadImage } from "@/lib/admin/api-client";
import { buttonVariants } from "@/components/ui/button";
import { useToast } from "./toast";

/**
 * Multi-image gallery uploader for the admin form. Holds an ordered list of
 * image URLs (the project's extra images, beyond the cover). Uploads reuse the
 * same /api/admin/upload endpoint, one request per file.
 */
export function GalleryUploadField({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    const added: string[] = [];
    try {
      for (const file of files) {
        const { url } = await apiUploadImage(file);
        added.push(url);
      }
      onChange([...value, ...added]);
      toast(`${added.length} image${added.length > 1 ? "s" : ""} added`);
    } catch (error) {
      if (added.length) onChange([...value, ...added]);
      toast(error instanceof Error ? error.message : "Upload failed", "error");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {value.map((url, i) => (
            <li
              key={url}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-foreground/[0.04]"
            >
              <Image
                src={url}
                alt={`Gallery image ${i + 1}`}
                fill
                sizes="160px"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-black/55 p-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="Move earlier"
                  className="rounded px-1.5 text-xs text-white disabled:opacity-30"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  aria-label="Remove image"
                  className="rounded px-1.5 text-xs font-semibold text-white hover:text-red-300"
                >
                  ✕
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === value.length - 1}
                  aria-label="Move later"
                  className="rounded px-1.5 text-xs text-white disabled:opacity-30"
                >
                  →
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <input
        ref={inputRef}
        type="file"
        id="gallery-upload"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={onFiles}
        className="hidden"
      />
      <label
        htmlFor="gallery-upload"
        className={buttonVariants({
          variant: "outline",
          size: "sm",
          className: "cursor-pointer",
        })}
      >
        {uploading ? "Uploading…" : "Add images"}
      </label>
      <p className="text-xs text-muted">
        Shown as an auto-rotating slideshow on the home card when a project has
        more than one image. JPG, PNG, or WebP · max 2MB each.
      </p>
    </div>
  );
}
