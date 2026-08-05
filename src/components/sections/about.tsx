"use client";

import { useLanguage } from "@/components/providers/language-provider";

// Short "about me" blurb under the hero. Mirrors the hero's reveal animation.
export function About() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto max-w-2xl py-12 text-center sm:py-16">
      <h2
        className="reveal text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
        style={{ animationDelay: "0.05s" }}
      >
        {t.about.heading}
      </h2>
      <p
        className="reveal mt-4 text-base leading-relaxed text-muted"
        style={{ animationDelay: "0.12s" }}
      >
        {t.about.body}
      </p>
    </section>
  );
}
