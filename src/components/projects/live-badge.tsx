"use client";

import { useTranslations } from "@/components/providers/language-provider";

// Status badge overlaid on a project cover. `live` (green, pulsing) flags a
// completed + online project; `dev` (orange, pulsing) flags one still in
// progress; `done` (blue, steady) flags a finished project with no public URL —
// a local/desktop build, so there is nothing "running" to pulse for. The motion
// lives in .live-dot (globals.css) and pauses under reduced-motion + the a11y
// "stop animations" toggle. Decorative + non-interactive so it never blocks the
// card link beneath it.
type LiveVariant = "live" | "dev" | "done";

const LABEL_KEY = {
  live: "liveBadge",
  dev: "devBadge",
  done: "doneBadge",
} as const;

const DOT_CLASS = {
  live: "live-dot",
  dev: "live-dot live-dot--dev",
  done: "live-dot live-dot--done",
} as const;

export function LiveBadge({ variant = "live" }: { variant?: LiveVariant }) {
  const t = useTranslations();
  const label = t.projects[LABEL_KEY[variant]];
  const dotClass = DOT_CLASS[variant];
  return (
    <div className="pointer-events-none absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-white shadow-sm backdrop-blur">
      <span className={dotClass} aria-hidden />
      {label}
    </div>
  );
}
