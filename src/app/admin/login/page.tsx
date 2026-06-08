import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { LoginForm } from "@/components/admin/login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  // Already signed in → straight to the dashboard.
  if (await getSession()) redirect("/admin");
  return <LoginForm />;
}
