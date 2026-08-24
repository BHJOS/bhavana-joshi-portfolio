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

/** Clients shown in the homepage logo row, in display order. */
export const CLIENTS = [
  { name: 'Xerox', file: 'xerox.png' },
  { name: 'IBM', file: 'ibm.png' },
  { name: 'Bristol Myers Squibb', file: 'bms.png' },
  { name: 'Motorola', file: 'moto.png' },
  { name: 'Computershare', file: 'computershare.png' },
  { name: 'Suzuki', file: 'suzuki.png' },
] as const;
