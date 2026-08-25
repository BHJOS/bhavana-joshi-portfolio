/** Site-wide constants. Single source of truth for metadata and contact details. */

export const SITE_NAME = 'Bhavana Joshi — Design to Delivery';
export const SITE_TAGLINE = 'Creativity with purpose.';
export const SITE_DESCRIPTION =
  'Bhavana Joshi is a product designer working across digital design, advertising, and marketing communication. Creativity with purpose.';

/**
 * The old Squarespace site rendered the address as "bhavana.joshiatgmail.com" to dodge
 * scrapers. That breaks click-to-email and reads badly to a screen reader, so the new
 * site uses the real address everywhere.
 */
export const EMAIL = 'bhavana.joshi@gmail.com';
export const LINKEDIN = 'https://www.linkedin.com/in/bhavana-joshi-us';

export const NAV_LINKS = [
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
] as const;

/**
 * Clients shown in the homepage logo ticker, in display order.
 *
 * `h` is the rendered height in px, tuned PER LOGO. The files are trimmed to ink
 * bounds with wildly different aspect ratios (Computershare 5.4:1, Motorola 1:1),
 * so a uniform cap makes wordmarks tiny and square marks dominant. Tall lockups
 * (Motorola's circle-plus-wordmark, Suzuki's S) get more height than single-line
 * wordmarks so every logo reads at the same optical weight.
 */
export const CLIENTS = [
  { name: 'Xerox', file: 'xerox.png', h: 36 },
  { name: 'IBM', file: 'ibm.png', h: 36 },
  { name: 'Bristol Myers Squibb', file: 'bms.png', h: 52 },
  { name: 'Motorola', file: 'moto.png', h: 76 },
  { name: 'Computershare', file: 'computershare.png', h: 34 },
  { name: 'Suzuki', file: 'suzuki.png', h: 60 },
] as const;
