/** Supported UI locales. Hebrew is the default (RTL-first portfolio). */
export type Locale = "he" | "en";

/** A string that exists in both supported languages. */
export interface I18nText {
  he: string;
  en: string;
}

export type ProjectStatus = "completed" | "in-progress" | "archived";

/**
 * Project data model (PRD §4.1). Stored locale-agnostic: each translatable
 * field carries both languages, and the UI picks the active locale at render
 * time via `pickLocale`. This shape is what the future API/DB will return, so
 * components never need to change when the mock layer is swapped out.
 */
export interface Project {
  id: string;
  title: I18nText;
  description: I18nText;
  /** Short summary for cards (≤ ~160 chars). */
  shortDescription: I18nText;
  /** Cover image path/URL. */
  coverImage: string;
  githubUrl?: string;
  liveUrl?: string;
  tags: string[];
  featured?: boolean;
  order?: number;
  /** Whether the project is shown publicly. */
  visible: boolean;
  role?: string;
  year?: number;
  status?: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}
