"use client";

import { siteConfig } from "@/lib/site-config";
import { useLanguage } from "@/components/providers/language-provider";
import { Tag } from "@/components/ui/tag";

// Curated, categorized tech stack. Data lives in siteConfig.techStack; the
// category labels are translated via stack.categories.* in the i18n files.
export function TechStack() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto max-w-3xl py-12 sm:py-16">
      <h2
        className="reveal text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
        style={{ animationDelay: "0.05s" }}
      >
        {t.stack.heading}
      </h2>

      <div className="mt-10 space-y-7">
        {siteConfig.techStack.map((category, i) => (
          <div
            key={category.key}
            className="reveal"
            style={{ animationDelay: `${0.12 + i * 0.07}s` }}
          >
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
              {t.stack.categories[category.key]}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.items.map((item) => (
                <Tag key={item}>{item}</Tag>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
