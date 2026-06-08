import { HeaderBrand } from "@/components/layout/header-brand";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";

/**
 * Sticky top bar: brand on the start side, language + theme controls on the
 * end. The two controls are compact (a segmented HE|EN and an icon button) and
 * stay visible at every breakpoint — a hamburger to hide two small controls
 * would be worse UX than showing them, so the nav is intentionally flat.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur supports-[backdrop-filter]:bg-surface/60">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <HeaderBrand />
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
