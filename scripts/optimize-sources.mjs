#!/usr/bin/env node
/**
 * OPTIONAL. Converts large source PNGs in src/assets/ to WebP q90.
 *
 * Why this is safe:
 *   - Astro re-encodes every image at build time anyway (WebP/AVIF, resized to the
 *     widths each component asks for). The source format affects the repo, not the
 *     delivered quality.
 *   - bhavanajoshi-rescue/ keeps the untouched originals, so nothing is lost.
 *
 * Measured effect on this project: src/assets 80.7MB -> 13.0MB (-84%).
 *
 * Why it is NOT run automatically: it rewrites files Bhavana asked to be copied as
 * originals. Run it deliberately, or not at all.
 *
 * Run:  node scripts/optimize-sources.mjs          (dry run — reports, changes nothing)
 *       node scripts/optimize-sources.mjs --apply  (converts, rewrites MDX imports)
 */
import sharp from 'sharp';
import { readdirSync, statSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { join, relative } from 'node:path';

const APPLY = process.argv.includes('--apply');
const MIN_BYTES = 200 * 1024; // leave small files alone — nothing to gain
const QUALITY = 90;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    statSync(p).isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
}

const candidates = walk('src/assets').filter(
  (f) => /\.png$/i.test(f) && statSync(f).size >= MIN_BYTES
);

let before = 0;
let after = 0;
const renames = new Map(); // old basename -> new basename

for (const file of candidates) {
  const size = statSync(file).size;
  const dest = file.replace(/\.png$/i, '.webp');
  const buf = await sharp(file).webp({ quality: QUALITY, effort: 5 }).toBuffer();

  before += size;
  after += buf.length;

  console.log(
    `${relative('src/assets', file).padEnd(62)} ` +
      `${(size / 1048576).toFixed(2)}MB -> ${(buf.length / 1048576).toFixed(2)}MB`
  );

  if (APPLY) {
    writeFileSync(dest, buf);
    unlinkSync(file);
    renames.set(file.split('/').pop(), dest.split('/').pop());
  }
}

console.log('\n' + '='.repeat(70));
console.log(`${candidates.length} files: ${(before / 1048576).toFixed(1)}MB -> ${(after / 1048576).toFixed(1)}MB`);

if (!APPLY) {
  console.log('\nDry run. Nothing changed. Re-run with --apply to convert.');
} else {
  // Repoint every import in the MDX case studies at the new extension.
  const mdx = walk('src/content').filter((f) => /\.mdx?$/.test(f));
  let edits = 0;
  for (const file of mdx) {
    let text = readFileSync(file, 'utf8');
    const original = text;
    for (const [oldName, newName] of renames) {
      text = text.split(oldName).join(newName);
    }
    if (text !== original) {
      writeFileSync(file, text);
      edits++;
    }
  }
  console.log(`\nConverted. Rewrote imports in ${edits} content file(s).`);
  console.log('Now run: npm run verify');
  console.log('Note: src/pages/*.astro imports (e.g. the about portrait) are NOT rewritten —');
  console.log('      check those by hand if the build reports a missing asset.');
}
