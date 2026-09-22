import type { SiteSettings } from '@/types/content';
import { parkCity } from './location';

export const siteSettings: SiteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  siteName: 'Treehouse',
  // PLACEHOLDER: footer strapline, not from the brand guide.
  tagline: "Park City's indoor play cafe",
  logo: {
    url: '/images/logo_treehouse_full-color.svg',
    alt: 'Treehouse',
    width: 332,
    height: 65,
  },
  logoWhite: {
    url: '/images/logo_treehouse_white.svg',
    alt: 'Treehouse',
    width: 332,
    height: 65,
  },
  // At launch the hamburger menu holds exactly these two links.
  primaryNav: [
    { label: 'Home', kind: 'internal', href: '/' },
    { label: 'Early Bird', kind: 'internal', href: '/early-bird' },
  ],
  /**
   * The footer carries the launch pages plus the Phase 2 pages that do not
   * exist yet. The '#' entries are PLACEHOLDER and must be given real hrefs
   * before launch, or removed.
   */
  footerNav: [
    { label: 'Home', kind: 'internal', href: '/' },
    { label: 'Early Bird', kind: 'internal', href: '/early-bird' },
    { label: 'Visit', kind: 'anchor', href: '#' },
    { label: 'Memberships', kind: 'anchor', href: '#' },
    { label: 'Parties', kind: 'anchor', href: '#' },
    { label: 'Cafe', kind: 'anchor', href: '#' },
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
