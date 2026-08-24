# Bhavana Joshi — Design to Delivery

Portfolio site for Bhavana Joshi, product designer. Replaces the Squarespace site at
`www.bhavanajoshi.com`. Static Astro, deployed to Cloudflare Pages.

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
| Output       | `static`. Cloudflare Pages needs no adapter — do not add one.          |
| Hosting      | Cloudflare Pages only. No Vercel/Netlify/Node config.                  |

**Never** add a hosting adapter, a CSS framework beyond Tailwind, an icon library, or an
animation library. If something seems to need one, ask first.

---

## Aesthetic

Minimal black-and-white editorial.

- White background. Near-black text `#111`. Generous whitespace.
- Pure black (`#000`) blocks used as section breaks — the only "accent".
- **No** gradients. **No** drop shadows. **No** rounded-corner cards. **No** decorative colour.
- Rules/borders are hairline (`1px`) and near-black or a light grey — never mid-grey mush.

### The work is the colour.

The UI stays monochrome so that case-study imagery supplies every bit of visual interest.
If a design decision would introduce colour to chrome, the answer is no.

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

Short, declarative sentences. No exclamation marks. No marketing hype. No em-dash-heavy
throat-clearing. Write it the way a confident designer talks about their own work.

---

## Layout

- **Mobile-first.** Design the small screen first, then add breakpoints upward.
- Max content width **~1100px** (`--container-content`), centred.
- Case-study images may break out to **full-bleed** — that is the one permitted escape
  from the content column.
- Vertical rhythm comes from the spacing scale, not from ad-hoc margins.

---

## Accessibility — non-negotiable

- **Every image has meaningful alt text.** If alt text has not been supplied for an image,
  **flag the file to Bhavana** — do not invent alt text. Decorative images get `alt=""`
  and only when genuinely decorative.
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
hero:    image()
heroAlt: string
gated:   boolean   // true = sits behind Cloudflare Access after deploy
order:   number    // manual sort on the index — lower comes first
```

`gated: true` pages are **excluded from sitemap.xml** and get `noindex`.

### Case-study body structure

Every case study uses these sections, in this order, as `<h2>`s:

**Challenge → My Role → Process → Key Decisions → Outcome**

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
| `FullBleed`   | Edge-to-edge image, escapes the content column |
| `TwoUp`       | Two images side by side, stacking on mobile    |
| `BeforeAfter` | Labelled before/after comparison pair          |
| `Gallery`     | Responsive image grid                          |
| `PullQuote`   | Oversized editorial quote                      |
| `Stats`       | Results/outcome row of figures                 |

All of them take Astro `image()` references and render through `<Image>`. All of them
require `alt`. None of them ship client JS.

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

## Working agreement

- Build in **phases**, stop for review where the brief says stop.
- **Git commits per phase.** Do not push anywhere — Bhavana connects GitHub and
  Cloudflare Pages herself.
- Placeholder content is always **clearly marked** and paired with a TODO listing exactly
  what Bhavana needs to supply. Never let a placeholder read as if it were real.
