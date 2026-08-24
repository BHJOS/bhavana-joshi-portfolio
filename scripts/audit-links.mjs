#!/usr/bin/env node
/**
 * Internal-link and heading-order audit over the built site.
 *
 * Checks:
 *   1. Every internal href resolves to a built page, a _redirects rule, or a real asset.
 *   2. No heading-level skips (h1 -> h3), and exactly one <h1> per page.
 *
 * Run: npm run audit:links      (requires `npm run build` first)
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');

if (!existsSync(DIST)) {
  console.error('dist/ not found — run `npm run build` first.');
  process.exit(1);
}

function walk(dir, filter, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, filter, out);
    else if (filter(p)) out.push(p);
  }
  return out;
}

const htmlFiles = walk(DIST, (p) => p.endsWith('.html'));

/** Set of routes the built site serves. */
const routes = new Set(
  htmlFiles.map((f) => {
    const rel = '/' + relative(DIST, f).replace(/\\/g, '/');
    return rel.replace(/index\.html$/, '').replace(/\.html$/, '/');
  })
);

/** Redirect sources from public/_redirects. */
const redirects = new Set();
const redirFile = join(ROOT, 'public', '_redirects');
if (existsSync(redirFile)) {
  for (const line of readFileSync(redirFile, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    redirects.add(t.split(/\s+/)[0].replace(/\/$/, '') || '/');
  }
}

const norm = (p) => (p.endsWith('/') ? p : p + '/');
const brokenLinks = [];
const headingIssues = [];

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const page = '/' + relative(DIST, file).replace(/\\/g, '/');

  // --- links ---
  for (const m of html.matchAll(/<a\b[^>]*\shref="([^"]+)"/gi)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|#|data:)/i.test(href)) continue;
    const path = href.split('#')[0].split('?')[0];
    if (!path) continue;
    const bare = path.replace(/\/$/, '') || '/';
    if (routes.has(norm(path)) || routes.has(path)) continue;
    if (redirects.has(bare)) continue;
    if (existsSync(join(DIST, path))) continue;
    brokenLinks.push({ page, href });
  }

  // --- headings ---
  const levels = [...html.matchAll(/<h([1-6])\b/gi)].map((m) => Number(m[1]));
  const h1s = levels.filter((l) => l === 1).length;
  if (h1s !== 1) headingIssues.push({ page, issue: `${h1s} <h1> elements (expected exactly 1)` });
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1] + 1) {
      headingIssues.push({ page, issue: `h${levels[i - 1]} -> h${levels[i]} skips a level` });
    }
  }
}

console.log('\nLINK + HEADING AUDIT');
console.log('='.repeat(70));
console.log(`\nPages checked: ${htmlFiles.length}`);

if (brokenLinks.length) {
  console.log(`\nBROKEN INTERNAL LINKS: ${brokenLinks.length}`);
  for (const b of brokenLinks) console.log(`  ${b.page}  ->  ${b.href}`);
} else {
  console.log('\nOK: all internal links resolve.');
}

if (headingIssues.length) {
  console.log(`\nHEADING ISSUES: ${headingIssues.length}`);
  for (const h of headingIssues) console.log(`  ${h.page}: ${h.issue}`);
} else {
  console.log('OK: no heading-level skips, one <h1> per page.');
}

console.log('');
process.exit(brokenLinks.length || headingIssues.length ? 1 : 0);
