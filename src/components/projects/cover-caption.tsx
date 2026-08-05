import type { Project } from "@/types/project";

/**
 * Wordmark burned over a project cover — the treatment the old generated SVG
 * placeholders had built into the artwork. Real screenshots replaced those, so
 * the caption is drawn in HTML instead of the image: it stays crisp at every
 * resolution, is selectable, and follows a renamed project without re-exporting
 * anything.
 *
 * The title is always the English one. The card heading right below already
 * carries the localized title, so repeating it here would print the same string
 * twice in Hebrew; the English name reads as a wordmark against it. That makes
 * the caption decorative, hence `aria-hidden` — screen readers get the heading.
 */
export function CoverCaption({ project }: { project: Project }) {
  // First two tags stand in for the kicker line the SVGs had ("BROWSER
  // AUTOMATION · PLAYWRIGHT"). Skip it rather than print a stray separator when
  // a project carries no tags.
  const kicker = project.tags.slice(0, 2).join(" · ");
  // Titles carry a dash-separated subtitle ("FinCoreAI — Personal Finance
  // Intelligence System"); only the name works as a wordmark. Split on a spaced
  // dash so hyphenated names ("Zeit-fur-Brot") stay intact.
  const wordmark = project.title.en.split(/\s+[—–-]\s+/)[0];

  return (
    <div
      aria-hidden
      dir="ltr"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-4 pb-3 pt-10 text-left transition-opacity duration-300 group-hover:opacity-0 group-focus-visible:opacity-0"
    >
      {kicker && (
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-accent drop-shadow">
          {kicker}
        </p>
      )}
      <p className="mt-0.5 line-clamp-2 text-lg font-bold leading-tight tracking-tight text-white drop-shadow-md">
        {wordmark}
      </p>
    </div>
  );
}
