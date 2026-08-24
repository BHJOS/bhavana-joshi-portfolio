#!/usr/bin/env node
/**
 * One-time prep for the client logo row.
 *
 * The Squarespace originals are all 1024x683 canvases with the mark floating small
 * in the middle, so rendering them at a uniform height makes every logo look tiny
 * and optically unbalanced. This trims each to its ink bounds and writes it back to
 * src/assets/logos/, letting the layout size them by their real proportions.
 *
 * Reads from bhavanajoshi-rescue/ (the untouched archive of originals), so it is
 * safe to re-run and never double-trims. The trimmed PNGs are committed, so this
 * only needs running if the logos are re-imported.
 *
 * Run: node scripts/prepare-logos.mjs
 */
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';

const SOURCES = {
  'xerox.png': 'c9efeb87_xerox.png',
  'ibm.png': 'bad7fe8d_IBM.png',
  'bms.png': '9433771d_bms.png',
  'moto.png': '4627054f_moto.png',
  'computershare.png': 'c37b0057_computershare.png',
  'suzuki.png': 'e397cd84_suzuki.png',
};

const RESCUE = 'bhavanajoshi-rescue/images';
const OUT = 'src/assets/logos';

if (!existsSync(RESCUE)) {
  console.error(`${RESCUE} not found. This script needs the rescue archive.`);
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });

for (const [dest, src] of Object.entries(SOURCES)) {
  const info = await sharp(`${RESCUE}/${src}`)
    .trim({ threshold: 10 })
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}/${dest}`);
  console.log(`${dest.padEnd(20)} -> ${info.width}x${info.height}`);
}
