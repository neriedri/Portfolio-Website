"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageOffIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * Cover image with a graceful fallback (PRD edge case: image fails to load →
 * placeholder + alt text). The wrapper must define an aspect ratio.
 */
export function CoverImage({
  src,
  alt,
  sizes,
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const [errored, setErrored] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-foreground/[0.04]",
        className,
      )}
    >
      {errored ? (
        <div
          className="absolute inset-0 grid place-items-center text-muted"
          role="img"
          aria-label={alt}
        >
          <ImageOffIcon />
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-focus-visible:scale-105"
          onError={() => setErrored(true)}
        />
      )}
    </div>
  );
}
