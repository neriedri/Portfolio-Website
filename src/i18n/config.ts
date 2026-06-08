import type { I18nText, Locale } from "@/types/project";
import he from "./he.json";
import en from "./en.json";

/**
 * Default language for first-time visitors. Hebrew-first portfolio (RTL).
 * Keep this in sync with the inline init script in the root layout, which
 * hardcodes the same default for pre-paint direction.
 */
export const DEFAULT_LOCALE: Locale = "he";

export const LOCALES: Locale[] = ["he", "en"];

/** Text direction for a locale. */
export function dir(locale: Locale): "rtl" | "ltr" {
  return locale === "he" ? "rtl" : "ltr";
}

/** Normalize any input to a supported locale (fallback per PRD edge case). */
export function normalizeLocale(value: string | null | undefined): Locale {
  return value === "he" || value === "en" ? value : DEFAULT_LOCALE;
}

/** Pick the active-locale string from a bilingual field (PRD §4.1). */
export function pickLocale(field: I18nText, locale: Locale): string {
  return field[locale] ?? field.en;
}

/** Shape of a translation dictionary — `en.json` is the source of truth. */
export type Dictionary = typeof en;

export const dictionaries: Record<Locale, Dictionary> = {
  he: he as Dictionary,
  en,
};
