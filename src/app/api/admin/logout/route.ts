import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/session";
import { isSameOrigin } from "@/lib/security";
import { jsonError } from "@/lib/api";

export async function POST(req: Request) {
  if (!isSameOrigin(req)) return jsonError(403, "Forbidden");
  await deleteSession();
  return NextResponse.json({ ok: true });
}
