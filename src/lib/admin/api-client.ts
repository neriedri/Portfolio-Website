import type { Project } from "@/types/project";
import type { ProjectInput } from "@/lib/validation/project";

/**
 * Client-side fetch helpers for the admin UI. All requests are same-origin, so
 * the browser sends Origin/Referer and passes the server's CSRF check.
 */

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = "Request failed";
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // non-JSON error body
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

const jsonHeaders = { "Content-Type": "application/json" };

export async function apiLogin(username: string, password: string) {
  return handle<{ ok: true }>(
    await fetch("/api/admin/login", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({ username, password }),
    }),
  );
}

export async function apiLogout() {
  return handle<{ ok: true }>(
    await fetch("/api/admin/logout", { method: "POST" }),
  );
}

export async function apiCreateProject(input: ProjectInput) {
  return handle<Project>(
    await fetch("/api/admin/projects", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(input),
    }),
  );
}

export async function apiUpdateProject(id: string, input: ProjectInput) {
  return handle<Project>(
    await fetch(`/api/admin/projects/${id}`, {
      method: "PUT",
      headers: jsonHeaders,
      body: JSON.stringify(input),
    }),
  );
}

export async function apiDeleteProject(id: string) {
  return handle<{ ok: true }>(
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" }),
  );
}

export async function apiSetVisibility(id: string, visible: boolean) {
  return handle<Project>(
    await fetch(`/api/admin/projects/${id}`, {
      method: "PATCH",
      headers: jsonHeaders,
      body: JSON.stringify({ visible }),
    }),
  );
}

export async function apiUploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return handle<{ url: string }>(
    await fetch("/api/admin/upload", { method: "POST", body: formData }),
  );
}
