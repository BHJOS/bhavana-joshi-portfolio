#!/usr/bin/env node
/**
 * Alt-text audit.
 *
 * Two jobs:
 *   1. Report every image flagged `altTodo` / `heroAltTodo` — these render alt=""
 *      on purpose, and are waiting on Bhavana to write a real description.
 *   2. Fail loudly if any <img> in dist/ has NO alt attribute at all. An absent
 *      alt is a real accessibility bug; alt="" is a deliberate decision.
 *
 * Run: npm run audit:alt        (build first for the dist/ half to be meaningful)
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();

function walk(dir, filter, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, filter, out);
    else if (filter(p)) out.push(p);
  }
  return out;
}

// ---------------------------------------------------------------- source TODOs
// Only content and pages — NOT src/components/mdx, whose files define the altTodo
// prop and would otherwise match their own implementation.
const contentFiles = [
  ...walk(join(ROOT, 'src', 'content'), (p) => /\.mdx?$/.test(p)),
  ...walk(join(ROOT, 'src', 'pages'), (p) => /\.astro$/.test(p)),
];
const todos = [];

for (const file of contentFiles) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    const rel = relative(ROOT, file);
    const at = (text) => todos.push({ file: rel, line: i + 1, text });

    // Front matter: hero image awaiting alt text.
    if (/^\s*heroAltTodo:\s*true/.test(line)) return at('hero image');

    // JSX usage: `altTodo` bare prop, or `altTodo: true` inside an items array.
    const uses = line.match(/\baltTodo\b(?!\s*[?:]\s*(boolean|false))/g);
    if (uses) {
      // The image name may sit on this line or, in a multi-line `items` entry,
      // a line or two above it.
      let src = null;
      for (let k = i; k >= Math.max(0, i - 3) && !src; k--) {
        src = lines[k].match(/src=\{(\w+)\}/) ?? lines[k].match(/src:\s*(\w+)/);
      }
      return at(src ? `image: ${src[1]}` : line.trim().slice(0, 70));
    }

    // Hand-written markers in .astro pages.
    if (/TODO\(alt\)/.test(line)) at('TODO(alt) marker');
  });
}

// ------------------------------------------------------------- built HTML check
const htmlFiles = walk(join(ROOT, 'dist'), (p) => p.endsWith('.html'));
const missingAlt = [];

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    // Astro emits alt="" as the bare attribute `alt`, which HTML5 parses as an
    // empty alt — valid, and the correct markup for a decorative image. So accept
    // `alt`, `alt=""` and `alt="..."`, but not `data-alt` or a missing attribute.
    if (!/\salt(?=[\s=>/])/i.test(m[0])) {
      missingAlt.push({ file: relative(ROOT, file), tag: m[0].slice(0, 120) });
    }
  }
}

// ------------------------------------------------------------------------ report
const byFile = todos.reduce((acc, t) => {
  (acc[t.file] ??= []).push(t);
  return acc;
}, {});

console.log('\nALT TEXT AUDIT');
console.log('='.repeat(70));

console.log(`\nFlagged, awaiting alt text from Bhavana: ${todos.length}`);
for (const [file, items] of Object.entries(byFile)) {
  console.log(`\n  ${file}  (${items.length})`);
  for (const it of items) console.log(`    line ${String(it.line).padStart(4)}  ${it.text}`);
}

console.log(`\n${'-'.repeat(70)}`);
if (!htmlFiles.length) {
  console.log('\ndist/ not found — run `npm run build` first to check the built HTML.');
} else if (missingAlt.length) {
  console.log(`\nFAIL: ${missingAlt.length} <img> with no alt attribute at all:`);
  for (const m of missingAlt) console.log(`  ${m.file}\n    ${m.tag}`);
  process.exit(1);
} else {
  console.log(`\nOK: every <img> across ${htmlFiles.length} built pages has an alt attribute.`);
  console.log('   (Flagged images intentionally use alt="" until real text is written.)');
}
console.log('');
