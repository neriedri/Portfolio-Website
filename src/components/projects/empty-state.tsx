"use client";

import { useTranslations } from "@/components/providers/language-provider";
import { ImageOffIcon } from "@/components/ui/icons";

/** Shown when no projects match the active filter (PRD edge case / §5.5). */
export function EmptyState() {
  const t = useTranslations();
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border px-6 py-16 text-center">
      <div className="text-muted">
        <ImageOffIcon />
      </div>
      <h3 className="text-lg font-medium text-foreground">
        {t.projects.emptyTitle}
      </h3>
      <p className="max-w-sm text-sm text-muted">{t.projects.emptyBody}</p>
    </div>
  );
}
