"use client";

import { siteConfig } from "@/lib/site-config";
import { useLanguage } from "@/components/providers/language-provider";
import { pickLocale } from "@/i18n/config";
import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/ui/icons";

// Glassy, translucent social pill with a lift + accent glow on hover/focus.
const socialPill =
  "lift glow inline-flex items-center gap-2 rounded-full border border-border " +
  "bg-foreground/[0.03] px-5 py-2.5 text-sm font-medium text-foreground backdrop-blur " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function Hero() {
  const { locale, t } = useLanguage();
  const name = pickLocale(siteConfig.name, locale);

  return (
    <section className="relative py-20 text-center sm:py-28">
      <h1
        className="reveal text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
        style={{ animationDelay: "0.05s" }}
      >
        {t.hero.greeting}{" "}
        <span className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
          {name}
        </span>
      </h1>
      <p
        className="reveal mt-4 text-lg text-muted sm:text-xl"
        style={{ animationDelay: "0.12s" }}
      >
        {t.hero.role}
      </p>
      <p
        className="reveal mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted"
        style={{ animationDelay: "0.19s" }}
      >
        {t.hero.bio}
      </p>

      <div
        className="reveal mt-8 flex flex-wrap items-center justify-center gap-3"
        style={{ animationDelay: "0.26s" }}
      >
        <a
          href={siteConfig.social.github}
          target="_blank"
          rel="noopener noreferrer"
          className={socialPill}
        >
          <GitHubIcon />
          {t.hero.viewGithub}
        </a>
        <a
          href={siteConfig.social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={socialPill}
        >
          <LinkedInIcon />
          {t.hero.viewLinkedin}
        </a>
        <a href={`mailto:${siteConfig.social.email}`} className={socialPill}>
          <MailIcon />
          {t.hero.sendEmail}
        </a>
      </div>

      <div
        className="reveal mt-7 flex justify-center"
        style={{ animationDelay: "0.33s" }}
      >
        <a
          href="#projects"
          className="cta-glow inline-flex items-center justify-center rounded-full bg-accent px-8 py-3 text-base font-semibold text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {t.hero.cta}
        </a>
      </div>
    </section>
  );
}
