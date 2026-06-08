import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

/**
 * Image storage abstraction. Two backends, chosen at runtime:
 *  - **Vercel Blob** when BLOB_READ_WRITE_TOKEN is set (production on Vercel,
 *    where the filesystem is ephemeral/read-only).
 *  - **Local disk** (`public/uploads`) otherwise, for local development.
 *
 * Both return a URL the browser can load via next/image: an absolute
 * `https://…public.blob.vercel-storage.com/…` URL from Blob, or a root-relative
 * `/uploads/…` path from disk.
 */

const EXT_BY_MIME: Record<string, string> = {
  "image/webp": "webp",
};

/** Persist an already-processed image buffer; returns its public URL. */
export async function saveImage(
  data: Buffer,
  contentType = "image/webp",
): Promise<string> {
  const ext = EXT_BY_MIME[contentType] ?? "webp";
  const filename = `${randomUUID()}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    // Dynamic import keeps @vercel/blob out of the bundle when unused locally.
    const { put } = await import("@vercel/blob");
    const blob = await put(`uploads/${filename}`, data, {
      access: "public",
      contentType,
      // Filenames are already random UUIDs; don't let Blob append a suffix.
      addRandomSuffix: false,
    });
    return blob.url;
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), data);
  return `/uploads/${filename}`;
}
