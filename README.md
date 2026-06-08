# Portfolio Website

A private personal portfolio for showcasing development projects. Bilingual
(Hebrew/English, RTL/LTR) with dark/light themes.

> **Status:** MVP (Phase 1) — public site running on mock data. Backend, admin
> panel, and auth are planned later phases (see [PRD.md](PRD.md)).

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (CSS-based config, class dark mode)
- Lightweight client-side **i18n** (`localStorage` toggle, no locale routing)
- Mock data behind a data-access layer — Prisma/DB wired in a later phase

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build (also type-checks)
npm run start    # serve the production build
npm run lint     # ESLint
```

Copy `.env.example` to `.env.local` if you need to override defaults (none are
required for the MVP).

## Personalizing

- **Identity & links:** `src/lib/site-config.ts` (name, GitHub/LinkedIn/email).
- **Projects:** `src/lib/mock-data.ts` (titles/descriptions are bilingual).
- **Cover art:** `public/covers/*.svg`.
- **UI strings:** `src/i18n/he.json` and `src/i18n/en.json`.
- **Design tokens (colors):** `src/app/globals.css`.

## How it's organized

```
src/
├── app/                  # routes: / and /projects/[id]
├── components/
│   ├── providers/        # theme + language context
│   ├── ui/               # Button, Tag, Skeleton, toggles, icons
│   ├── layout/           # Header, Footer, SkipLink
│   ├── projects/         # cards, grid, filter, detail
│   └── sections/         # Hero, 404 view
├── i18n/                 # he.json / en.json + config
├── lib/                  # projects.ts (data-access), site-config, utils
└── types/                # Project model
```

`src/lib/projects.ts` is the single seam for the future backend: it reads mock
data today and is the only file that changes when the API/DB lands.

## Notes

- Theme and text direction are applied **before first paint** via an inline
  script (`src/lib/theme-script.ts`) to avoid a flash of the wrong theme/dir.
- Language preference persists in `localStorage`. On a full page reload the
  text content briefly renders in the default language (Hebrew) before
  reconciling — a known MVP tradeoff; a cookie-based SSR locale can remove it.
- The site is marked `noindex` (private portfolio).
# Portfolio-Website
