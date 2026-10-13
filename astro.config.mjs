// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * Path fragments excluded from sitemap.xml — these case studies sit behind
 * Cloudflare Access. Kept in sync with `gated: true` in the work collection AND with
 * the Access application's destinations (a new gated study needs both).
 * TODO(phase 4): derive this from the content collection instead of hand-maintaining it.
 */
const GATED_PATHS = [
  '/work/issuer-online',
  '/work/interactive-visual-aids',
  '/work/designing-in-code',
  '/work/patient-profile-tool',
];

// https://astro.build/config
export default defineConfig({
  // Production domain, live since 2026-10. Drives canonical URLs, absolute og:image
  // paths, and sitemap.xml entries.
  site: 'https://www.bhavanajoshi.com',

  // Cloudflare serves the `dist/` folder directly (Workers static assets, wrangler.jsonc).
  // No adapter — see CLAUDE.md.
  output: 'static',

  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !GATED_PATHS.some((path) => page.includes(path)),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
