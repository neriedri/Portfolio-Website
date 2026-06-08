"use client";

import { useRouter } from "next/navigation";
import { apiLogout } from "@/lib/admin/api-client";
import { Button } from "@/components/ui/button";
import { useToast } from "./toast";

export function LogoutButton() {
  const router = useRouter();
  const toast = useToast();

  async function onLogout() {
    try {
      await apiLogout();
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      toast(error instanceof Error ? error.message : "Logout failed", "error");
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={onLogout}>
      Logout
    </Button>
  );
}
