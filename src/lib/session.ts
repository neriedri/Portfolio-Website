import "server-only";
import { cookies } from "next/headers";
import {
  decryptSession,
  encryptSession,
  SESSION_COOKIE,
  type SessionPayload,
} from "./jwt";

const MAX_AGE_SECONDS = 60 * 60 * 24; // 24h (PRD §4.6)

/** Create the session cookie after successful login. */
export async function createSession(username: string): Promise<void> {
  const token = await encryptSession({ sub: username });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

/** Clear the session cookie on logout. */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/** Read + verify the current session, or null if absent/invalid. */
export async function getSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return decryptSession(token);
}
