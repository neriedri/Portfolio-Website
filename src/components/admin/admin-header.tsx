import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

/** Minimal admin top bar. Logout lives on the dashboard (not on the login page). */
export function AdminHeader() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/admin"
          className="rounded-md text-base font-semibold tracking-tight text-foreground"
        >
          Admin Panel
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-md text-sm text-muted transition-colors hover:text-foreground"
          >
            View site
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
