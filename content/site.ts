import type { SiteSettings } from '@/types/content';
import { parkCity } from './location';

export const siteSettings: SiteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  siteName: 'Treehouse',
  // PLACEHOLDER: footer strapline, not from the brand guide.
  tagline: "Park City's indoor play cafe",
  // v2 artwork from the client, trimmed of the transparent padding the supplied
  // file carried (4.7% each side, 14.2% top and bottom) so the image box is the
  // wordmark itself — the header aligns the trigger to this edge. Its colours
  // are deeper than the SVG it replaces, which read as washed out.
  logo: {
    url: '/images/logo_treehouse_v2.png',
    alt: 'Treehouse',
    width: 2176,
    height: 430,
  },
  logoWhite: {
    url: '/images/logo_treehouse_white.svg',
    alt: 'Treehouse',
    width: 332,
    height: 65,
  },
  // The homepage hamburger panel. Contact joins it because the page is real
  // and the homepage is otherwise a dead end to it — the top bar that carries
  // it elsewhere does not render here.
  primaryNav: [
    { label: 'Home', kind: 'internal', href: '/' },
    { label: 'Early Bird', kind: 'internal', href: '/early-bird' },
    { label: 'Contact', kind: 'internal', href: '/contact' },
  ],
  /**
   * The sub-page top bar. Only pages that exist go in it: a nav link to a page
   * that is not built is worse than no link at all.
   *
   * Visit, Memberships, Parties and Cafe belong here as they are built. Until
   * then they stay in the footer, pointed at the matching homepage section —
   * the footer is a directory and may point anywhere, while this bar is
   * navigation and should not.
   */
  topNav: [
    { page: '', label: 'Home' },
    // Early Bird is the main sub-page at launch and the one thing the bar most
    // needs to point at. It retires when the founding-membership sale closes,
    // and retiring it is deleting this line.
    { page: 'early-bird', label: 'Early Bird' },
    { page: 'contact', label: 'Contact' },
  ],
  /**
   * The footer carries the launch pages plus the Phase 2 pages that do not exist
   * yet. Until they do, those four point at the matching homepage section.
   * Path-qualified rather than bare fragments so they also work from
   * /early-bird, where a '#cafe' alone would do nothing. Repoint them at real
   * routes when those pages are built.
   */
  footerNav: [
    { label: 'Home', kind: 'internal', href: '/' },
    { label: 'Early Bird', kind: 'internal', href: '/early-bird' },
    { label: 'Contact', kind: 'internal', href: '/contact' },
    { label: 'Visit', kind: 'internal', href: '/#visit' },
    { label: 'Memberships', kind: 'internal', href: '/#memberships' },
    { label: 'Parties', kind: 'internal', href: '/#parties' },
    { label: 'Cafe', kind: 'internal', href: '/#cafe' },
  ],
  // PLACEHOLDER: real pages pending; the pre-sale terms page lands before launch.
  legalNav: [
    { label: 'Privacy', kind: 'anchor', href: '#' },
    { label: 'Terms', kind: 'anchor', href: '#' },
  ],
  /**
   * Empty on purpose: the accounts exist but the URLs are not confirmed. The
   * footer renders this column only when it is non-empty, so adding entries
   * here is the only step needed.
   */
  socialLinks: [],
  defaultSeo: {
    description:
      "A playground for the kids. A cafe for you. Park City's one and only premium indoor play space for ages 0–12.",
    // Pre-launch: nothing is indexable until the site goes public.
    noIndex: true,
  },
  location: parkCity,
};
