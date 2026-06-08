# Deploying to Vercel

This app is built to run on Vercel's serverless platform. The code already
adapts itself:

- **Images** → Vercel Blob in production, local disk in dev (`src/lib/storage.ts`)
- **Login rate-limit** → Upstash Redis in production, in-memory in dev (`src/lib/rate-limit.ts`)
- **Postgres** → pooled connection at runtime, direct connection for migrations (`prisma/schema.prisma`)

Each cloud backend turns on automatically when its environment variable is
present. Locally, with those vars blank, everything falls back to the dev
behavior — so nothing here breaks your local setup.

---

## 1. Push the repo

```bash
git add -A
git commit -m "Prepare for Vercel deploy"
git push        # to GitHub/GitLab/Bitbucket
```

> Make sure `.env` and `.env.local` are **not** committed (they're gitignored).
> Only `.env.example` should be in the repo.

## 2. Import into Vercel

1. Go to https://vercel.com/new and import the repo.
2. Framework preset auto-detects **Next.js**. Leave it.
3. **Override the Build Command** to apply DB migrations on every deploy:
   ```
   npm run db:deploy && npm run build
   ```
   (`db:deploy` = `prisma migrate deploy`. `postinstall` already runs
   `prisma generate`.)
4. Don't deploy yet — add the integrations and env vars first (next steps).

## 3. Add the three integrations (Storage tab → marketplace)

Each one auto-injects its own environment variables into the project.

| Integration | Gives you | Auto-injected vars |
|---|---|---|
| **Vercel Postgres** (Neon) | the database | `DATABASE_URL`, a pooled URL, and a non-pooling URL |
| **Vercel Blob** | image storage | `BLOB_READ_WRITE_TOKEN` |
| **Upstash Redis** | login rate-limit | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` |

### Map the Postgres URLs (important)

Prisma needs two specific names. The Postgres integration injects several —
open **Settings → Environment Variables** and make sure these two exist:

- **`DATABASE_URL`** → the **pooled** connection string (the host contains
  `-pooler`). The integration usually sets this for you.
- **`DIRECT_URL`** → the **non-pooling** string (often injected as
  `POSTGRES_URL_NON_POOLING` or `DATABASE_URL_UNPOOLED`). Add a new variable
  named `DIRECT_URL` and paste that non-pooling value in.

Runtime queries use the pooled URL; `prisma migrate deploy` uses `DIRECT_URL`.

## 4. Add the remaining env vars (Settings → Environment Variables)

| Name | Value | Notes |
|---|---|---|
| `SESSION_SECRET` | output of `openssl rand -base64 32` | a fresh one for prod, not your local value |
| `ADMIN_USERNAME` | e.g. `neri_manager` | |
| `ADMIN_PASSWORD_HASH` | bcrypt hash from `npm run hash-password -- "yourpassword"` | **paste it RAW — no `\$` escaping.** The backslashes in `.env.local` are only for the local dotenv parser. Vercel stores the value literally. |
| `NEXT_PUBLIC_SITE_URL` | your real URL, e.g. `https://yourname.vercel.app` | used by metadata |

> The site already sends `robots: noindex` (it's private). Leave that as-is
> unless you want search engines to index it.

## 5. Deploy

Click **Deploy**. The build runs `prisma migrate deploy` (creates your tables
on the fresh prod database) then `next build`.

## 6. First-run checklist (after the deploy is live)

1. Visit `https://your-app/admin/login` → log in with your prod credentials.
2. The project list will be **empty** — the prod database is brand new and
   separate from your local one. Add your projects through the admin panel.
3. Upload a cover image. If it appears, **Vercel Blob is working**. (The image
   URL will be `https://…public.blob.vercel-storage.com/uploads/…`.)
4. Optional: deliberately fail the login 5–6 times → you should get
   "Too many attempts" (confirms **Upstash rate-limit** is live).

> **Seed data:** the `prisma/seed.ts` sample projects are optional and meant
> for local dev. For production, just add real projects via the admin panel.
> (If you do want the samples: `vercel env pull .env.production.local` then
> `npx dotenv -e .env.production.local -- npm run db:seed`.)

---

## Notes

- **`npm audit` shows 2 moderate `postcss` warnings.** They're pinned by
  Next 16 (a build-time CSS-stringify issue, not a runtime hole) and the only
  "fix" downgrades Next to v9. Ignore until Next ships a patched postcss.
- **Local uploads** under `public/uploads/` are dev-only and gitignored; they
  do not deploy. Production images live in Blob.
- **Strict CSP, security headers, CSRF checks, bcrypt, httpOnly session
  cookie** are all already in place (see `SECURITY-AUDIT.md`).
