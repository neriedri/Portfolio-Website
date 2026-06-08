"use client";

import { siteConfig } from "@/lib/site-config";
import { useTranslations } from "@/components/providers/language-provider";
import { buttonVariants } from "@/components/ui/button";
import {
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
} from "@/components/ui/icons";

export function Hero() {
  const t = useTranslations();

  return (
    <section className="py-14 sm:py-20">
      <p className="text-sm font-medium text-accent">{t.hero.greeting}</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {siteConfig.name}
      </h1>
      <p className="mt-3 text-lg text-muted">{t.hero.role}</p>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
        {t.hero.bio}
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a href="#projects" className={buttonVariants({ variant: "primary" })}>
          {t.hero.cta}
        </a>
        <a
          href={siteConfig.social.github}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <GitHubIcon />
          {t.hero.viewGithub}
        </a>
        <a
          href={siteConfig.social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <LinkedInIcon />
          {t.hero.viewLinkedin}
        </a>
        <a
          href={`mailto:${siteConfig.social.email}`}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <MailIcon />
          {t.hero.sendEmail}
        </a>
      </div>
    </section>
  );
}
