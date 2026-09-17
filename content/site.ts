import type { SiteSettings } from '@/types/content';
import { parkCity } from './location';

export const siteSettings: SiteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  siteName: 'Treehouse',
  tagline: 'neighborhood play cafe',
  logo: {
    // PLACEHOLDER: stand-in wordmark pending final brand files.
    url: '/logo.svg',
    alt: 'Treehouse — Park City, Utah',
    width: 420,
    height: 140,
  },
  // At launch the hamburger menu holds exactly these two links.
  primaryNav: [
    { label: 'Home', kind: 'internal', href: '/' },
    { label: 'Early Bird', kind: 'internal', href: '/early-bird' },
  ],
  defaultSeo: {
    description:
      "A playground for the kids. A cafe for you. Park City's one and only premium indoor play space for ages 0–12.",
    // Pre-launch: nothing is indexable until the site goes public.
    noIndex: true,
  },
  location: parkCity,
};
