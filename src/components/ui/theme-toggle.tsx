"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { useTranslations } from "@/components/providers/language-provider";
import { buttonVariants } from "./button";
import { MoonIcon, SunIcon } from "./icons";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={t.actions.toggleTheme}
      title={t.actions.toggleTheme}
      className={buttonVariants({ variant: "ghost", size: "icon" })}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
