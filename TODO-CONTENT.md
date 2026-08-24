# Content I need from you

No `bhavanajoshi-rescue/` folder was found anywhere near this project, so the site is
scaffolded with **clearly-marked placeholder content**. Nothing on the site is real copy
or a real image yet.

Two ways to unblock this:

- **Option A (preferred):** drop the `bhavanajoshi-rescue/` folder next to this project —
  I'll read `manifest.json` and build the case studies from it directly.
- **Option B:** supply the items below by hand.

---

## 1. Case studies — three of them

### Issuer Online — Computershare — `gated: true`

| Field       | Needed                                                          |
| ----------- | --------------------------------------------------------------- |
| `year`      | ☐                                                                |
| `role`      | ☐ e.g. "Lead Product Designer"                                   |
| `summary`   | ☐ 1–2 sentences — doubles as the meta description                |
| `tags`      | ☐ 2–4, e.g. `["product design", "design systems"]`               |
| `hero`      | ☐ one image, original resolution, landscape                      |
| `heroAlt`   | ☐ **I will not invent this** — see note on alt text below        |
| Body copy   | ☐ Challenge · My Role · Process · Key Decisions · Outcome        |
| Body images | ☐ with alt text for each                                         |

### Interactive Visual Aids — pharma — `gated: true`

Same fields as above. Also: **which pharma client** should appear in the `client` field,
or should it read "Confidential"?

### West Windsor Arts Center — public

Same fields as above. This is the one built end-to-end in Phase 3, so it's the one I need
first.

---

## 2. Homepage

- ☐ **Positioning paragraph** — the 2–3 sentences that sit under "Creativity with purpose."
      I have the headline from your current site; I don't have this.
- ☐ **Client logos** — SVG preferred, one file each:
      Xerox · IBM · BMS · Motorola · Computershare · Suzuki
      (If you don't have vector versions, say so and I'll set them as text wordmarks
      instead — that stays on-brand for a monochrome site and costs nothing in payload.)

---

## 3. About page

- ☐ **Bio** — a few paragraphs in your voice.
- ☐ **Photo of you** — original resolution.
- ☐ **Alt text for the photo.**

Already have: `bhavana.joshi@gmail.com` and
`https://www.linkedin.com/in/bhavana-joshi-us`.

---

## 4. Decisions I need from you

- ☐ **Production domain.** `astro.config.mjs` currently assumes `https://www.bhavanajoshi.com`.
      Confirm, or give me the Cloudflare Pages URL to use until the DNS cuts over. This
      drives canonical URLs, absolute `og:image` paths, and the sitemap.
- ☐ **Old Squarespace URLs.** I have the six paths you listed. If there are others in the
      wild (from LinkedIn, a résumé PDF, an email signature), list them and I'll add 301s.
- ☐ **Archive work** — Websites, Emails, Logos, Books. The schema exists; no pages are
      built. Tell me when you've decided whether it stays.
- ☐ **Typeface.** Poppins has no variable version — Google ships it only as 18 static
      weights. I used **Outfit Variable**, the closest geometric sans with a real variable
      file. If you'd rather have literal Poppins, say so and I'll self-host two static
      cuts (regular + bold) instead — it costs roughly one extra font request.

---

## A note on alt text

Per your own accessibility rule, **I will not write alt text for an image I haven't been
given context for.** Inventing it produces confident-sounding descriptions that are
subtly wrong, which is worse for a screen-reader user than no image at all.

Every image you send should come with a sentence describing what it shows and why it's in
the case study. If an image is purely decorative, tell me that and it gets `alt=""`.

Any file missing alt text will be **flagged in the Phase 5 verification checklist**, not
quietly filled in.
