"use client";

import { useLanguage } from "@/components/providers/language-provider";
import type { Locale } from "@/types/project";
import { cn } from "@/lib/utils";

const OPTIONS: { value: Locale; label: string }[] = [
  { value: "he", label: "HE" },
  { value: "en", label: "EN" },
];

export function LanguageToggle() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t.actions.toggleLanguage}
      className="inline-flex items-center rounded-lg border border-border bg-surface p-0.5"
    >
      {OPTIONS.map((option) => {
        const active = locale === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setLocale(option.value)}
            aria-pressed={active}
            className={cn(
              "rounded-md px-2.5 py-1 font-mono text-xs font-medium transition-colors duration-200 cursor-pointer",
              active
                ? "bg-accent text-accent-foreground"
                : "text-muted hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
