/**
 * Central place for owner identity + social links so they live in one spot.
 * Edit these to personalize the portfolio.
 */
export const siteConfig = {
  /** Display name shown in the header logo and hero — switches with the locale. */
  name: {
    he: "נרי אדרי",
    en: "Neri Edri",
  },
  /** Short handle / initials used as a fallback logo mark. */
  initials: "NE",
  social: {
    github: "https://github.com/neriedri",
    linkedin: "https://www.linkedin.com/in/neria-edri-111388341",
    email: "neriapple7@gmail.com",
  },
  /** Tech stack credited in the footer. */
  builtWith: "Next.js · TypeScript · Tailwind CSS",
  /**
   * Curated tech stack shown on the home page, grouped by category.
   * `key` maps to a label in i18n (`stack.categories.*`).
   */
  techStack: [
    { key: "backend", items: ["Python", "FastAPI", "SQLAlchemy", "Celery", "Redis"] },
    { key: "frontend", items: ["React", "TypeScript", "JavaScript", "Tailwind CSS"] },
    { key: "databases", items: ["PostgreSQL", "SQL Server", "SQLite"] },
    { key: "automation", items: ["Playwright", "AI Integration"] },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
