import { getAllTags, getProjects } from "@/lib/projects";
import { Hero } from "@/components/sections/hero";
import { ProjectsBrowser } from "@/components/projects/projects-browser";

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

  return (
    <>
      <Hero />
      <div className="pb-16">
        <ProjectsBrowser
          projects={filtered}
          tags={tags}
          activeTag={activeTag}
        />
      </div>
    </>
  );
}
