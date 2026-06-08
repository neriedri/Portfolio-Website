import { NextResponse } from "next/server";
import { getAllTags } from "@/lib/projects";

export const dynamic = "force-dynamic";

export async function GET() {
  const tags = await getAllTags();
  return NextResponse.json(tags);
}
