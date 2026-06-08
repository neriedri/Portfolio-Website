import "server-only";
import bcrypt from "bcryptjs";

/**
 * Single-owner credential check. The username + bcrypt password hash live in
 * env (ADMIN_USERNAME / ADMIN_PASSWORD_HASH) — there is no users table.
 */
export async function verifyCredentials(
  username: string,
  password: string,
): Promise<boolean> {
  const expectedUser = process.env.ADMIN_USERNAME;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!expectedUser || !passwordHash) {
    throw new Error("Admin credentials are not configured");
  }
  // bcrypt.compare is constant-time; always run it to avoid leaking via timing.
  const passwordOk = await bcrypt.compare(password, passwordHash);
  return username === expectedUser && passwordOk;
}
