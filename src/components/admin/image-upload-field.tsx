"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { apiUploadImage } from "@/lib/admin/api-client";
import { buttonVariants } from "@/components/ui/button";
import { useToast } from "./toast";

export function ImageUploadField({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await apiUploadImage(file);
      onChange(url);
      toast("Image uploaded");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Upload failed", "error");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border border-border bg-foreground/[0.04]">
        {value ? (
          <Image
            src={value}
            alt="Cover preview"
            fill
            sizes="128px"
            className="object-cover"
          />
        ) : (
          <div className="grid h-full place-items-center text-xs text-muted">
            No image
          </div>
        )}
      </div>
      <div>
        <input
          ref={inputRef}
          type="file"
          id="cover-upload"
          accept="image/jpeg,image/png,image/webp"
          onChange={onFile}
          className="hidden"
        />
        <label
          htmlFor="cover-upload"
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "cursor-pointer",
          })}
        >
          {uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
        </label>
        <p className="mt-1 text-xs text-muted">JPG, PNG, or WebP · max 2MB</p>
      </div>
    </div>
  );
}
