import { cn } from "@/lib/utils";

/** A small monospace tag/badge (PRD: tags use a mono font). Presentational. */
export function Tag({
  children,
  active = false,
  className,
}: {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-xs",
        active
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border bg-background text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
