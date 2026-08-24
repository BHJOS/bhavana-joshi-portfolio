ARCHIVE COLLECTION — schema defined, no pages built.

The four older Squarespace portfolio categories go here: Websites, Emails, Logos, Books.

Per the brief: the schema exists (see src/content.config.ts) so this work has somewhere
to land, but NO archive pages are built yet — Bhavana has not decided whether this older
work carries over to the new site.

When that call is made, add one .md file per piece with front matter:

  title:    string
  category: "websites" | "emails" | "logos" | "books"
  client:   string   (optional)
  year:     number   (optional)
  summary:  string   (optional)
  hero:     image    (optional)
  heroAlt:  string   (optional — REQUIRED if hero is set)
  order:    number   (optional, defaults to 0)

This file is named .md.txt so the glob loader ignores it.
