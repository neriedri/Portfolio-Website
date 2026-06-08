import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyCredentials } from "@/lib/auth";
import { createSession } from "@/lib/session";
import {
  clearAttempts,
  isRateLimited,
  recordFailedAttempt,
} from "@/lib/rate-limit";
import { isSameOrigin } from "@/lib/security";
import { jsonError } from "@/lib/api";

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  if (!isSameOrigin(req)) return jsonError(403, "Forbidden");

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const key = `login:${ip}`;

  const rl = await isRateLimited(key);
  if (rl.limited) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfterSeconds ?? 900) },
      },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError(400, "Invalid request");

  const ok = await verifyCredentials(parsed.data.username, parsed.data.password);
  if (!ok) {
    await recordFailedAttempt(key);
    return jsonError(401, "Invalid username or password");
  }

  await clearAttempts(key);
  await createSession(parsed.data.username);
  return NextResponse.json({ ok: true });
}
