"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import { AccessibilityIcon, CloseIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * Self-contained accessibility menu (Israeli IS 5568 / WCAG 2.0 AA "adjustments"
 * pattern). Deliberately first-party — no third-party widget script, so it stays
 * within our strict Content-Security-Policy. Adjustments are applied as classes
 * / a CSS var on <html> (see globals.css) and persisted to localStorage.
 */

const STORAGE_KEY = "a11y";
const FONT_SCALES = [1, 1.1, 1.25, 1.4];

interface A11yState {
  scaleIndex: number;
  contrast: boolean;
  links: boolean;
  noMotion: boolean;
}

const DEFAULT_STATE: A11yState = {
  scaleIndex: 0,
  contrast: false,
  links: false,
  noMotion: false,
};

function apply(state: A11yState) {
  const html = document.documentElement;
  html.style.setProperty("--a11y-font-scale", String(FONT_SCALES[state.scaleIndex]));
  html.classList.toggle("a11y-contrast", state.contrast);
  html.classList.toggle("a11y-links", state.links);
  html.classList.toggle("a11y-no-motion", state.noMotion);
}

export function AccessibilityWidget() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<A11yState>(DEFAULT_STATE);
  const panelId = useId();
  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Restore saved preferences after mount (avoids SSR/client mismatch).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = { ...DEFAULT_STATE, ...JSON.parse(raw) } as A11yState;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState(saved);
        apply(saved);
      }
    } catch {
      // ignore malformed/blocked storage
    }
  }, []);

  const update = useCallback((next: A11yState) => {
    setState(next);
    apply(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage failures
    }
  }, []);

  const reset = useCallback(() => {
    update(DEFAULT_STATE);
  }, [update]);

  // Close on Escape; close on outside click; focus the panel when opened.
  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("button, a")?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    }
    function onClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        !panelRef.current?.contains(target) &&
        !launcherRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const currentPct = Math.round(FONT_SCALES[state.scaleIndex] * 100);

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t.a11y.title}
        aria-expanded={open}
        aria-controls={panelId}
        className="fixed bottom-4 start-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg ring-1 ring-black/10 transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <AccessibilityIcon />
      </button>

      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-label={t.a11y.title}
          className="animate-fade-in fixed bottom-20 start-4 z-50 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-surface p-4 shadow-2xl"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              {t.a11y.title}
            </h2>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                launcherRef.current?.focus();
              }}
              aria-label={t.a11y.close}
              className="rounded-md p-1 text-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <CloseIcon width={18} height={18} />
            </button>
          </div>

          {/* Font size */}
          <div className="mb-3">
            <div className="mb-1.5 flex items-center justify-between text-xs text-muted">
              <span>{t.a11y.fontSize}</span>
              <span className="font-mono">{currentPct}%</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  update({
                    ...state,
                    scaleIndex: Math.max(0, state.scaleIndex - 1),
                  })
                }
                disabled={state.scaleIndex === 0}
                aria-label={t.a11y.decrease}
                className="h-9 flex-1 rounded-lg border border-border bg-background text-base font-semibold text-foreground transition-colors hover:bg-foreground/[0.05] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                A−
              </button>
              <button
                type="button"
                onClick={() =>
                  update({
                    ...state,
                    scaleIndex: Math.min(
                      FONT_SCALES.length - 1,
                      state.scaleIndex + 1,
                    ),
                  })
                }
                disabled={state.scaleIndex === FONT_SCALES.length - 1}
                aria-label={t.a11y.increase}
                className="h-9 flex-1 rounded-lg border border-border bg-background text-lg font-semibold text-foreground transition-colors hover:bg-foreground/[0.05] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                A+
              </button>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-col gap-2">
            <Toggle
              label={t.a11y.contrast}
              pressed={state.contrast}
              onToggle={() => update({ ...state, contrast: !state.contrast })}
            />
            <Toggle
              label={t.a11y.highlightLinks}
              pressed={state.links}
              onToggle={() => update({ ...state, links: !state.links })}
            />
            <Toggle
              label={t.a11y.stopMotion}
              pressed={state.noMotion}
              onToggle={() => update({ ...state, noMotion: !state.noMotion })}
            />
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <Link
              href="/accessibility"
              onClick={() => setOpen(false)}
              className="rounded text-xs text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {t.a11y.statement}
            </Link>
            <button
              type="button"
              onClick={reset}
              className="rounded-md px-2 py-1 text-xs font-medium text-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {t.a11y.reset}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Toggle({
  label,
  pressed,
  onToggle,
}: {
  label: string;
  pressed: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={pressed}
      className={cn(
        "flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        pressed
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border bg-background text-foreground hover:bg-foreground/[0.05]",
      )}
    >
      <span>{label}</span>
      <span
        aria-hidden
        className={cn(
          "ms-2 inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors",
          pressed ? "bg-accent-foreground/30" : "bg-foreground/15",
        )}
      >
        <span
          className={cn(
            "h-4 w-4 rounded-full bg-current transition-transform",
            pressed ? "translate-x-4 rtl:-translate-x-4" : "translate-x-0",
          )}
        />
      </span>
    </button>
  );
}
