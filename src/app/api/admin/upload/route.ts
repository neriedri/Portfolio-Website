import { NextResponse } from "next/server";
import sharp from "sharp";
import { guardAdmin, jsonError } from "@/lib/api";
import { saveImage } from "@/lib/storage";

export const runtime = "nodejs"; // sharp + fs require the Node runtime
export const dynamic = "force-dynamic";

const MAX_BYTES = 2 * 1024 * 1024; // 2MB (PRD §4.6)
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];

/** Verify the bytes really are an allowed image (declared MIME can be spoofed). */
function sniffImage(buf: Buffer): boolean {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff)
    return true; // JPEG
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  )
    return true; // PNG
  if (
    buf.length >= 12 &&
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  )
    return true; // WebP
  return false;
}

export async function POST(req: Request) {
  const guard = await guardAdmin(req, { mutation: true });
  if (guard instanceof Response) return guard;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return jsonError(400, "Invalid form data");
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return jsonError(400, "No file uploaded");
  }
  if (file.size > MAX_BYTES) {
    return jsonError(413, "File too large (max 2MB)");
  }
  if (!ALLOWED_MIME.includes(file.type)) {
    return jsonError(415, "Unsupported file type (use JPG, PNG, or WebP)");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length > MAX_BYTES) return jsonError(413, "File too large (max 2MB)");
  if (!sniffImage(buffer)) return jsonError(415, "File is not a valid image");

  // Re-encode to WebP (also strips EXIF / any embedded payload) and bound size.
  let output: Buffer;
  try {
    output = await sharp(buffer)
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
  } catch {
    return jsonError(422, "Could not process image");
  }

  // Vercel Blob in prod, local disk in dev — see src/lib/storage.ts.
  const url = await saveImage(output, "image/webp");

  return NextResponse.json({ url });
}
