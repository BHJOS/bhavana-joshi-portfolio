// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * Path fragments excluded from sitemap.xml — these case studies sit behind
 * Cloudflare Access after deploy. Kept in sync with `gated: true` in the work collection.
 * TODO(phase 4): derive this from the content collection instead of hand-maintaining it.
 */
const GATED_PATHS = [
  '/work/issuer-online',
  '/work/interactive-visual-aids',
  '/work/west-windsor-arts-center-v2', // draft under review — not gated, just unlisted
];

// https://astro.build/config
export default defineConfig({
  // TODO(bhavana): confirm the production domain before the first Cloudflare deploy.
  // This drives canonical URLs, absolute og:image paths, and sitemap.xml entries.
  site: 'https://www.bhavanajoshi.com',

  // Cloudflare Pages serves the `dist/` folder directly. No adapter — see CLAUDE.md.
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
