import { z } from "zod";

// URL-or-empty → undefined. Regex keeps validation stable across Zod versions.
const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined))
  .refine((v) => v === undefined || /^https?:\/\/.+/i.test(v), {
    message: "Must be a valid http(s) URL",
  });

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined));

const i18nText = z.object({
  he: z.string().trim().min(1, "Required"),
  en: z.string().trim().min(1, "Required"),
});

const i18nShort = z.object({
  he: z.string().trim().min(1, "Required").max(200),
  en: z.string().trim().min(1, "Required").max(200),
});

/** Shared by the admin API (server validation) and the admin form (RHF resolver). */
export const projectInputSchema = z.object({
  title: i18nText,
  shortDescription: i18nShort,
  description: i18nText,
  coverImage: z.string().trim().min(1, "A cover image is required"),
  images: z.array(z.string().trim().min(1)).default([]),
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  tags: z
    .array(z.string().trim().min(1))
    .default([])
    .transform((tags) => Array.from(new Set(tags))),
  featured: z.boolean().default(false),
  order: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? 0 : v),
    z.coerce.number().int(),
  ),
  visible: z.boolean().default(true),
  role: optionalText,
  year: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z.coerce.number().int().min(1990).max(2100).optional(),
  ),
  status: z.preprocess(
    (v) => (v === "" || v === null ? undefined : v),
    z.enum(["completed", "in-progress", "archived"]).optional(),
  ),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;

/** Default empty values for the create form. */
export const emptyProjectInput: ProjectInput = {
  title: { he: "", en: "" },
  shortDescription: { he: "", en: "" },
  description: { he: "", en: "" },
  coverImage: "",
  images: [],
  githubUrl: undefined,
  liveUrl: undefined,
  tags: [],
  featured: false,
  order: 0,
  visible: true,
  role: undefined,
  year: undefined,
  status: undefined,
};
