/**
 * Central place for owner identity + social links so they live in one spot.
 * Edit these to personalize the portfolio.
 */
export const siteConfig = {
  /** Display name shown in the header logo and hero. */
  name: "Your Name",
  /** Short handle / initials used as a fallback logo mark. */
  initials: "YN",
  social: {
    github: "https://github.com/your-username",
    linkedin: "https://www.linkedin.com/in/your-username",
    email: "you@example.com",
  },
  /** Tech stack credited in the footer. */
  builtWith: "Next.js · TypeScript · Tailwind CSS",
} as const;

export type SiteConfig = typeof siteConfig;
