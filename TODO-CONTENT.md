# Content status

The `bhavanajoshi-rescue/` export has been read and the site is built from it. All three
case studies, the homepage, and the about page now carry **real copy and real images** —
no placeholder text remains anywhere on the site.

`bhavanajoshi-rescue/` is gitignored and untouched. It stays as the archive of originals.

---

## 1. Alt text — 84 images need it

**This is the only thing blocking an accessible launch.**

The Squarespace site had almost no alt text: the rescue `REPORT.txt` records 24 of 26
missing on West Windsor, 36 of 38 on Interactive Visual Aid, 23 of 37 on Issuer Online.
Per your own rule, none of it has been invented.

Every flagged image currently renders `alt=""` — silent to a screen reader, rather than
announced with a confident-sounding guess. Run this to get the full list, file by file
and line by line:

```bash
npm run audit:alt
```

Current count:

| File | Images needing alt |
| --- | --- |
| `src/content/work/interactive-visual-aids.mdx` | 36 |
| `src/content/work/issuer-online.mdx` | 0 — done in the 2026-08-25 redraft |
| `src/content/work/west-windsor-arts-center.mdx` | 24 |
| `src/pages/about.astro` (your portrait) | 1 |
| **Total** | **61** |

**How to fill one in.** In the MDX, replace `altTodo` with real text:

```diff
- <Figure src={sitemap} altTodo caption="Site architecture" />
+ <Figure src={sitemap} alt="Six-level site map ..." caption="Site architecture" />
```

For the hero image in front matter, delete `heroAltTodo: true` and add `heroAlt: '...'`.

The build **fails** if you leave an image with neither — that is deliberate.

Images that are genuinely decorative should get `alt=""` explicitly, not `altTodo`.
Tell me which ones and I will set them.

---

## 2. Decisions I need from you

### Repo weight — 80MB of images (please decide before you push)

`src/assets/` holds the 90 original-resolution images the site uses: **80.7MB**. They were
copied as originals, exactly as you asked.

Worth knowing before this hits GitHub: Astro re-encodes every image at build time anyway,
so the source format affects **repo size only, not delivered quality**. Converting the
large PNGs to WebP q90 sources measures at:

> **80.7MB → 13.0MB (−84%)**

Dry run (changes nothing):

```bash
node scripts/optimize-sources.mjs
```

Apply it:

```bash
node scripts/optimize-sources.mjs --apply && npm run verify
```

I did not run it for you — you said copy the originals, and some people want lossless
masters in the repo. But it is far cheaper to decide now, at one commit, than after the
repo is pushed and the 80MB is permanently in history.

### Everything else

- ☐ **Client logos are lossy PNGs** lifted from Squarespace, with the whitespace trimmed
      off (`scripts/prepare-logos.mjs`). They render acceptably, but Bristol Myers Squibb
      in particular reads small and soft next to Xerox and IBM. **SVG versions would fix
      both.** If you have them, drop them in `src/assets/logos/`.
- ☐ **Two Squarespace pages were password-locked** and could not be captured:
      `/interactive-visual-aid-1-1` and `/interactive-visual-aid-pp`. Both currently 301 to
      `/work/interactive-visual-aids`. If they held different content, turn the password
      off and re-run the rescue, or tell me what was on them.
- ☐ **Archive work** — Websites, Emails, Logos, Books. Schema exists, no pages built, all
      four paths 301 to `/work` for now. Say the word if it stays and I will build it.
- ☐ **Year on Issuer Online** is set to `2024`, inferred from the old site's copyright
      line. Confirm or correct.
- ☐ **The IVA client** is credited as **Bristol Myers Squibb**, which the case-study copy
      names directly ("BMS medical-legal teams", "under the umbrella brand of Bristol Myers
      Squibb"). Confirm that is fine to state publicly, given the page is gated anyway.

---

## 3. Things the rescue did not contain

- **No alt text**, as above.
- **No site logo.** `bha_logo_24.png` was the one image that failed to download. The new
  site uses a text wordmark in the nav instead, which suits the monochrome editorial
  direction. If you want the mark back, send the file.
- **No favicon.** Still Astro's default. Send one, or I can set the wordmark initials.
- **No `og:image` artwork.** I generated a plain type-only fallback at
  `public/og-default.png` from your tagline. Case-study pages use their own hero, so this
  only shows for `/`, `/work`, `/about`, and `/404`. Replace it if you want something
  designed.
- **Four Squarespace paths 404'd during capture** (`/home-old`, `/home-1`, `/new-page`,
  `/new-page-1`). They look like abandoned drafts. No redirects were written for them.

---

## A note on alt text

I will not write alt text for an image I lack context for. Inventing it produces
confident-sounding descriptions that are subtly wrong, which is worse for a screen-reader
user than silence.

Every image you describe should get a sentence saying what it shows and why it is in the
case study. `npm run audit:alt` is the checklist.
