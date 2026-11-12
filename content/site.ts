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
   * The footer's single row of links. Parties is a Phase 2 page that does not
   * exist yet and points at the matching homepage section until it does;
   * path-qualified rather than a bare fragment so it also works from
   * /early-bird, where a '#parties' alone would do nothing. Repoint it at a
   * real route when that page is built.
   *
   * Visit, Memberships and Cafe were here too and are held back for now. The
   * homepage sections they pointed at are all still there.
   *
   * legalNav renders on the end of this same row — see SiteFooter.
   */
  footerNav: [
    { label: 'Home', kind: 'internal', href: '/' },
    { label: 'Early Bird', kind: 'internal', href: '/early-bird' },
    { label: 'Contact', kind: 'internal', href: '/contact' },
    { label: 'Parties', kind: 'internal', href: '/#parties' },
  ],
  // PLACEHOLDER: real pages pending; the pre-sale terms page lands before launch.
  legalNav: [
    { label: 'Privacy', kind: 'anchor', href: '#' },
    { label: 'Terms', kind: 'anchor', href: '#' },
  ],
  /**
   * Instagram is live. Facebook and X are placeholders: the row reads as
   * complete, but an entry with no `url` renders as the glyph alone rather
   * than as a link to nowhere. Paste the urls in when the client confirms
   * them and they become links — no other change.
   */
  socialLinks: [
    {
      _key: 'instagram',
      platform: 'instagram',
      url: 'https://www.instagram.com/treehouse.parkcity',
    },
    // PLACEHOLDER: awaiting the client's accounts.
    { _key: 'facebook', platform: 'facebook' },
    { _key: 'x', platform: 'x' },
  ],
  defaultSeo: {
    description:
      "A playground for the kids. A cafe for you. Park City's one and only premium indoor play space for ages 0–12.",
    // Pre-launch: nothing is indexable until the site goes public.
    noIndex: true,
  },
  location: parkCity,
};
