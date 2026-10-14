# Bhavana Joshi — Design to Delivery

Portfolio site for Bhavana Joshi, product designer. Live at `https://www.bhavanajoshi.com`
since 2026-10, replacing the Squarespace site. Static Astro, deployed to Cloudflare
(Workers static assets).

> `CLAUDE.md` is a symlink to this file. Editing either edits both.

---

## Stack — fixed decisions. Do not revisit.

| Concern      | Decision                                                              |
| ------------ | --------------------------------------------------------------------- |
| Framework    | Astro 7, started from the **minimal** template. Not a theme.           |
| UI framework | **None.** No React / Vue / Svelte.                                     |
| Client JS    | Zero, unless a specific component genuinely cannot work without it.    |
| Styling      | Tailwind CSS v4 via `@tailwindcss/vite`.                               |
| Content      | Astro Content Collections — markdown / MDX, one file per project.      |
| Images       | Astro `<Image>` / `<Picture>` only. WebP + AVIF, srcset, lazy below fold. |
| Integrations | `@astrojs/mdx`, `@astrojs/sitemap`. Nothing else without asking.       |
| Output       | `static`. Cloudflare serves `dist/` as-is — no adapter, do not add one. |
| Hosting      | Cloudflare Workers static assets, via `wrangler.jsonc` (assets-only, no Worker code). Cloudflare stopped offering Pages for new Git projects by 2026-09-16, so the Worker replaces the planned Pages project. No Vercel/Netlify/Node config. |

**Never** add a hosting adapter, a CSS framework beyond Tailwind, an icon library, or an
animation library. If something seems to need one, ask first.

---

## Aesthetic

Minimal black-and-white editorial.

- White background. Near-black text `#111`. Generous whitespace.
- Pure black (`#000`) blocks used as section breaks — the only "accent".
- One sanctioned tint: the footer background `--color-footer: #e0e0db`, carried over
  from the Squarespace site's footer (its lightAccent, hsl(60 7.46% 86.86%)). Nothing
  else gets a tint.
- **No** gradients. **No** drop shadows. **No** rounded-corner cards or panels.
  **No** decorative color. The one exception is work cards, on the Work index (`/work`)
  and the homepage grid alike, where the thumbnails carry a 16px radius
  (`rounded-2xl`, the `rounded` prop on `WorkCard`) with the hairline border
  (Bhavana, 2026-09-15 for /work, 2026-10-14 for the homepage). Everywhere else,
  including case-study figures and the portrait, image frames stay square-edged. Images in a row (TwoUp, Gallery, BeforeAfter, work cards) share
  one frame ratio and sit centered inside it with `object-contain`, never cropped.
  Two sanctioned exceptions, both opt-in per figure (see MDX components): photographs
  may fill their frame with cover fit, and artwork that already sits on white may drop
  the hairline frame (`borderless`). UI screenshots always keep the frame and contain fit.
- Rules/borders are hairline (`1px`) and near-black or a light gray — never mid-gray mush.

### The work is the color.

The UI stays monochrome so that case-study imagery supplies every bit of visual interest.
If a design decision would introduce color to chrome, the answer is no.

---

## Type

- **One family throughout: Outfit Variable**, self-hosted via `@fontsource-variable/outfit`.
  - Rationale: the brief asked for Poppins or a close equivalent **as a variable font**.
    Poppins ships only as static weights — there is no `@fontsource-variable/poppins`.
    Outfit is the closest geometric sans (circular bowls, tall x-height, near-identical
    feel at display sizes) and ships a true variable file, so headline weight and body
    weight cost one download instead of two.
- Headlines: heavy weight (700–800). Body: regular (400). Meta/labels: medium (500).
- Large type scale. The hero headline should feel **oversized and confident** — it is the
  first thing that reads as a design decision.
- `font-display: swap` — never FOIT. The font is preloaded in `<head>`.
- Type scale tokens live in `src/styles/global.css` under `@theme`. Use the tokens, not
  arbitrary `text-[42px]` values.

### Voice

Bhavana's existing site copy. `"Creativity with purpose."`

Short, declarative sentences. No exclamation marks. No marketing hype. Write it the way
a confident designer talks about their own work.

Hard style rules for all visible prose — body copy, headings, captions, stat labels,
meta descriptions (Bhavana, 2026-08; enforced across all pages):

- **No colons, no semicolons, no em dashes.** Recast as separate sentences or commas.
  Exemptions: alt text (screen-reader prose, not displayed) and the `<title>` separator
  ("Page — Bhavana Joshi").
- **American English spellings** throughout. Careful: `aria-labelledby` is an ARIA spec
  attribute (double L by definition), never "corrected".

---

## Layout

- **Mobile-first.** Design the small screen first, then add breakpoints upward.
- Max content width **~1100px** (`--container-content`), centered.
- Case-study images may break out to **full-bleed** — that is the one permitted escape
  from the content column.
- Vertical rhythm comes from the spacing scale, not from ad-hoc margins.

---

## Accessibility — non-negotiable

- **Every image has meaningful alt text.** If alt text has not been supplied for an image,
  **flag the file to Bhavana** — do not invent alt text. Decorative images get `alt=""`
  and only when genuinely decorative.

  The mechanism: every MDX image component takes either `alt` or `altTodo`, and **throws
  at build time if given neither**. `altTodo` renders `alt=""` (silent) rather than a
  placeholder string, and is reported by `npm run audit:alt`. Work front matter uses
  `heroAlt` / `heroAltTodo` the same way, enforced by a zod `.refine`.
  Never clear an `altTodo` by writing the description yourself.
- WCAG **AA** contrast minimum on all text (the monochrome palette makes this easy —
  `#111` on `#fff` is 18.9:1; do not drop below `#595959` on white for body text).
- **Visible focus states** on every interactive element. Never `outline: none` without a
  replacement that is at least as visible.
- **Semantic heading order.** No skipping levels. One `<h1>` per page.
- Nav is fully keyboard-navigable. Skip-to-content link on every page.
- `prefers-reduced-motion` respected if any motion is ever added.

---

## Performance budget

| Metric                | Target       |
| --------------------- | ------------ |
| Lighthouse (all four) | **≥ 95**     |
| Total JS shipped      | **< 20 KB**  |
| Web-font FOIT         | **None**     |

Every new dependency must be justified against this budget.

---

## Content model

### `work` collection — `src/content/work/*.mdx`

```ts
title:   string
client:  string
year:    number
role:    string
summary: string    // 1–2 sentences. Used on cards AND as the meta description.
tags:    string[]  // e.g. ["product design", "design systems"]
hero:        image()
heroAlt:     string
heroAltTodo: boolean  // true = alt text still owed by Bhavana (see Accessibility)
gated:       boolean  // true = sits behind Cloudflare Access
draft:       boolean  // true = rewrite under review (see Visibility)
unlisted:    boolean  // true = finished but kept off the grid (see Visibility)
order:       number   // manual sort on the index — lower comes first
```

`gated: true` pages are **excluded from sitemap.xml** and get `noindex`.

### Visibility — `unlisted` vs `draft`

The helpers live in `src/consts.ts`: `isBuilt`, `inSequence` (prev/next chain),
`isListed` (homepage grid and `/work`).

| Flag | Grid + `/work` | Prev/next chain | Sitemap | Page builds |
| --- | --- | --- | --- | --- |
| `unlisted: true` | no | **yes**, slotted by `order` | no (`noindex`) | yes |
| `draft: true` | no | no | no (`noindex`) | **yes** |

- `unlisted` is for finished work kept off the grid. The Interactive Patient Profile
  Tool (order 4) is unlisted. It sits in the chain between Future State IVAs and the
  Arts Center and is linked from the end of the IVAs study. Do not promote it to the grid.
- `draft` is for a rewrite under review. **A draft still builds and is reachable by URL
  once pushed**, so review drafts on the local server, never on the live site.
- `HIDE_GATED=1 npm run build` drops every gated study from the build entirely. Off in
  production. A pre-launch safety switch kept for emergencies.

### Gated studies — Cloudflare Access

One Zero Trust self-hosted application ("Bhavana Joshi Portfolio") protects the gated
paths on `www.bhavanajoshi.com`. Login is One-time PIN. To grant a viewer access, add
their email to the application's Allow policy (Bhavana does this).

**A new gated study needs its path in two places:** `GATED_PATHS` in
`astro.config.mjs` (keeps it out of the sitemap) and the Access application's
destinations (actually gates it). Access protects the pages, not the hashed image files
under `/_astro/`.

### Case-study body structure

Results-first narrative, established by the August 2026 redrafts (all three studies):

**Hero + 4-item proof strip (Stats) → constraint/insight-led opening → My role →
2-3 story sections → Results.**

Every image carries a narrating caption (what decision it shows or constraint it
solves) and observed alt text. One artifact per idea — near-duplicate images get cut,
not stacked.

### `archive` collection — `src/content/archive/*.md`

The four older Squarespace portfolio categories: Websites, Emails, Logos, Books.
**Schema and content only. Do not build archive pages** — Bhavana has not decided whether
this older work stays on the new site.

---

## MDX components

These live in `src/components/mdx/` and are the point of the site — case studies are
image-dense, and these are how the images get to breathe.

| Component     | Purpose                                        |
| ------------- | ---------------------------------------------- |
| `Figure`      | Single captioned image; the shared primitive   |
| `FullBleed`   | Edge-to-edge image, escapes the content column |
| `TwoUp`       | Two images side by side, stacking on mobile    |
| `BeforeAfter` | Labeled before/after comparison pair          |
| `Gallery`     | Responsive image grid                          |
| `PullQuote`   | Oversized editorial quote                      |
| `Stats`       | Results/outcome row of figures                 |

All of them take Astro `image()` references and render through `<Image>`. All of them
require `alt` or `altTodo`. None of them ship client JS.

Opt-in options (all documented inline in the component files; the Arts Center study
uses every one):

- **`borderless`** on `Figure` and `TwoUp` drops the hairline frame. Only for artwork
  that already sits on white (logo sheets, color and type specimens, diagrams).
  **Before going borderless, check the image file for baked-in edge lines** (the 2010
  firehouse screenshot had one) and trim them from the original.
- **`Gallery fit="cover"`** fills each frame and crops the overflow, with an optional
  per-item `position` (CSS object-position). Photographs only, never UI screenshots.
- **`TwoUp` item `below`** stacks a second photo under the first in the same column,
  cover fit, with optional `zoom`, `position`, and `origin`. Photographs only. Skip
  per-item captions when using it.

Everything else keeps the hairline frame and `object-contain`.

**View every image before writing its caption or alt text.** Reference docs and asset
filenames have been wrong about image contents repeatedly.

---

## Routes

| Path                        | Notes                                                     |
| --------------------------- | --------------------------------------------------------- |
| `/`                         | Hero, client logo row, featured work grid, footer          |
| `/work`                     | All case studies as image cards                            |
| `/work/[slug]`              | Case-study detail                                          |
| `/about`                    | Bio, photo, `mailto:`, LinkedIn                            |
| `/404`                      | Same visual language as the rest                           |

### Legacy URLs that must not break

These paths existed on Squarespace and are linked from elsewhere. Keep them alive as
pages or 301s via `public/_redirects`:

`/case-studies` · `/portfolio` · `/west-windsor-arts-council` · `/issuer-online` ·
`/interactive-visual-aid` · `/about`

Clients on the logo row: **Xerox, IBM, BMS, Motorola, Computershare, Suzuki.**

---

## SEO

- Unique `<title>` and meta description on every page. Work pages derive description
  from `summary`.
- Per-page `og:image` from the project hero. Site-wide fallback: the homepage hero.
- `sitemap.xml` — **excludes gated pages**. `robots.txt`. Canonical URLs.
- JSON-LD `Person` schema on the homepage only.
- Site name: **"Bhavana Joshi — Design to Delivery"**

---

## Contact details (real, do not obfuscate)

- Email: `bhavana.joshi@gmail.com` — a real `mailto:` link. No "at" spelling-out.
- LinkedIn: `https://www.linkedin.com/in/bhavana-joshi-us`

---

## Commands

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server on :4321 |
| `npm run verify` | check → build → alt audit → link/heading audit. Run before every commit. |
| `npm run audit:alt` | Lists every image awaiting alt text; fails if any `<img>` lacks the attribute entirely |
| `npm run audit:links` | Fails on broken internal links, heading-level skips, or ≠1 `<h1>` |
| `node scripts/prepare-logos.mjs` | Re-trims client logos from the rescue archive |
| `node scripts/optimize-sources.mjs` | Optional: PNG sources → WebP q90. Dry run unless `--apply` |

## Content source

`bhavanajoshi-rescue/` is the Squarespace export — copy, original-resolution images, and
`manifest.json`. It is **gitignored and read-only**: the archive of originals. Images the
site actually uses were copied into `src/assets/`. Never edit the rescue folder, and never
commit it.

Local image filenames there are `<first-8-chars-of-the-URL-guid>_<basename>`. Some kept
percent-encoding (`colors%402x.png`), and a few carry a scraped `&quot;,` suffix.

## Working agreement

- Build in **phases**, stop for review where the brief says stop.
- **Commit per approved change.** Run `npm run verify` first and check the built HTML
  in `dist/`. Author `Bhavana <bhavana.joshi@gmail.com>`.
- **Push only when Bhavana says push.** `main` lives at
  `github.com/BHJOS/bhavana-joshi-portfolio`, and Cloudflare builds and deploys every
  push to `main` within about a minute. **A push is a publish.**
- Verify the live site with `curl --resolve www.bhavanajoshi.com:443:104.21.39.42`
  (a Cloudflare edge address) rather than trusting local DNS. Public pages return 200,
  gated pages return 302 to the Access login.
- Never touch DNS, Access, or Cloudflare settings without Bhavana.
- Placeholder content is always **clearly marked** and paired with a TODO listing exactly
  what Bhavana needs to supply. Never let a placeholder read as if it were real.
