import { SignJWT, jwtVerify } from "jose";

/**
 * Pure JWT helpers (no next/headers, not `server-only`) so they can be used in
 * both route handlers/DAL and the Proxy (which runs server-side and only does
 * an optimistic cookie check). Session cookie read/write lives in session.ts.
 */

export const SESSION_COOKIE = "session";

export interface SessionPayload {
  /** subject = admin username */
  sub: string;
  [key: string]: unknown;
}

function encodedKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function encryptSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(encodedKey());
}

export async function decryptSession(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encodedKey(), {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch {
    return null;
  }
}
