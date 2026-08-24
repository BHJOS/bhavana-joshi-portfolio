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
      /** Required, and never auto-generated. See CLAUDE.md → Accessibility. */
      heroAlt: z.string().min(1),
      /** true = sits behind Cloudflare Access after deploy; excluded from sitemap. */
      gated: z.boolean().default(false),
      /** Manual sort on the work index — lower comes first. */
      order: z.number().int(),
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
