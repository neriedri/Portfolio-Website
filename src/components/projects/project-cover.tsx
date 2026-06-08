"use client";

import { useEffect, useState } from "react";
import { CoverImage } from "./cover-image";
import { cn } from "@/lib/utils";

const INTERVAL_MS = 4000;

/**
 * Project card cover. With a single image it's a static cover; with several it
 * auto-rotates every 4s (plain swap, no transition) so the grid feels alive.
 * Rotation pauses under prefers-reduced-motion, the accessibility "stop
 * animations" toggle, or when the tab is hidden.
 */
export function ProjectCover({
  images,
  alt,
  sizes,
  priority = false,
  className,
}: {
  images: string[];
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const count = images.length;

  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => {
      const html = document.documentElement;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || html.classList.contains("a11y-no-motion") || document.hidden) {
        return;
      }
      setIndex((i) => (i + 1) % count);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [count]);

  const safeIndex = index % count;

  return (
    <>
      <CoverImage
        src={images[safeIndex]}
        alt={alt}
        sizes={sizes}
        priority={priority}
        className={className}
      />
      {count > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-2 z-10 flex justify-center gap-1.5">
          {images.map((src, i) => (
            <span
              key={src}
              className={cn(
                "h-1.5 w-1.5 rounded-full ring-1 ring-black/20 transition-colors",
                i === safeIndex ? "bg-white" : "bg-white/40",
              )}
            />
          ))}
        </div>
      )}
    </>
  );
}
