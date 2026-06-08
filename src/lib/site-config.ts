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
    linkedin: "https://www.linkedin.com/in/neri-edri-111388341",
    email: "neriapple7@gmail.com",
  },
  /** Tech stack credited in the footer. */
  builtWith: "Next.js · TypeScript · Tailwind CSS",
} as const;

export type SiteConfig = typeof siteConfig;
