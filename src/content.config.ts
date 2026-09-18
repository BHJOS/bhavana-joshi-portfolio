import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// Imported directly rather than re-exported from `astro:content` — that re-export is
// deprecated in Astro 7. Same zod instance either way (deduped to the one Astro uses).
import { z } from 'zod';

/**
 * Case studies. One MDX file per project.
 *
 * Body structure is fixed — Challenge → My Role → Process → Key Decisions → Outcome.
 * See CLAUDE.md → Content model.
 */
const work = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      client: z.string(),
      year: z.number().int(),
      role: z.string(),
      /** 1–2 sentences. Used on index cards AND as the page meta description. */
      summary: z.string(),
      /** e.g. ["product design", "design systems"] */
      tags: z.array(z.string()).min(1),
      hero: image(),
      /**
       * Never auto-generated. See CLAUDE.md → Accessibility.
       * May be empty ONLY when `heroAltTodo` is true — see the refine below.
       */
      heroAlt: z.string().default(''),
      /**
       * true = Bhavana still needs to write this alt text. The image then renders
       * with alt="" (silent) rather than a wrong description, and `npm run audit:alt`
       * reports it. Never set this to false by writing alt text yourself.
       */
      heroAltTodo: z.boolean().default(false),
      /** true = sits behind Cloudflare Access after deploy; excluded from sitemap. */
      gated: z.boolean().default(false),
      /**
       * true = work-in-progress rewrite under review. The route builds and is
       * reachable by direct URL, but the entry is excluded from the homepage grid,
       * the /work index, prev/next navigation, and the sitemap, and gets noindex.
       */
      draft: z.boolean().default(false),
      /**
       * true = a finished study kept off the homepage grid and the /work index, but
       * still part of prev/next navigation, slotted in by `order` between its
       * neighbors. Gets noindex. Used for the Patient Profile Tool, which follows
       * Future State IVAs (Bhavana, 2026-09-18). Not for work in progress, use `draft`.
       */
      unlisted: z.boolean().default(false),
      /** Manual sort on the work index — lower comes first. */
      order: z.number().int(),
    })
      .refine((d) => d.heroAltTodo || d.heroAlt.trim().length > 0, {
        message:
          'heroAlt is empty. Either write real alt text, or set heroAltTodo: true to flag ' +
          'it for Bhavana. Do not invent a description.',
        path: ['heroAlt'],
      }),
});

/**
 * Older Squarespace portfolio work: Websites, Emails, Logos, Books.
 *
 * Schema and content only — no pages are built from this collection yet.
 * Bhavana has not decided whether this older work carries over to the new site.
 */
const archive = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/archive' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: z.enum(['websites', 'emails', 'logos', 'books']),
      client: z.string().optional(),
      year: z.number().int().optional(),
      summary: z.string().optional(),
      hero: image().optional(),
      heroAlt: z.string().optional(),
      order: z.number().int().default(0),
    }),
});

export const collections = { work, archive };
