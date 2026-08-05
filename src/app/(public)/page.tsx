import { getAllTags, getProjects } from "@/lib/projects";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { TechStack } from "@/components/sections/tech-stack";
import { ProjectsBrowser } from "@/components/projects/projects-browser";

// Tags hidden from the home filter only — projects still carry/show them on
// their own pages. Keeps the landing page focused on core tech.
const HOME_HIDDEN_TAGS = new Set([
  "AI_API",
  "WMI",
  "Tkinter",
  "PyInstaller",
  "Telegram Bot",
]);

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string | string[] }>;
}) {
  const sp = await searchParams;
  const tagParam = Array.isArray(sp.tag) ? sp.tag[0] : sp.tag;

  const [projects, tags] = await Promise.all([getProjects(), getAllTags()]);

  // Only honor a tag we actually know about (PRD edge: unknown filter → All).
  const activeTag = tagParam && tags.includes(tagParam) ? tagParam : null;
  const filtered = activeTag
    ? projects.filter((p) => p.tags.includes(activeTag))
    : projects;

  // Chips shown on the home filter, minus the hidden tags.
  const visibleTags = tags.filter((tag) => !HOME_HIDDEN_TAGS.has(tag));

  return (
    <>
      <Hero />
      <About />
      <TechStack />
      <div className="pb-16">
        <ProjectsBrowser
          projects={filtered}
          tags={visibleTags}
          activeTag={activeTag}
        />
      </div>
    </>
  );
}
