import type { Page } from '@/types/content';
import { parkCity } from '../location';
import { pt } from '../_portableText';
import { earlyBirdPerks, foundingPricingTable } from './_shared';

/**
 * Founding membership sales page. Copy is verbatim from early_bird_page.png.
 *
 * The pricing table here drops its own CTA because the ctaBanner immediately
 * below carries "be an early bird" — two identical buttons in a row is noise.
 */
export const earlyBirdPage: Page = {
  _id: 'page.early-bird',
  _type: 'page',
  title: 'hey, early bird!',
  slug: 'early-bird',
  seo: {
    title: 'Founding memberships — Treehouse Park City',
    description:
      "We're selling a limited number of founding membership spots and they will go fast!",
    noIndex: true,
  },
  location: parkCity,
  blocks: [
    {
      _key: 'page-header',
      _type: 'pageHeader',
      title: 'Early Birds',
      height: 'small',
      image: {
        // PLACEHOLDER: final photography pending.
        url: '/images/hero-play-structure.jpg',
        alt: '',
      },
    },
    {
      _key: 'band-hey-early-bird',
      _type: 'sectionBand',
      heading: 'hey, early bird!',
      color: 'sky',
      level: 'primary',
      accent: 'loop',
    },
    {
      _key: 'intro',
      _type: 'richText',
      align: 'center',
      content: pt(
        "We're selling a limited number of founding membership spots and they will go fast!",
      ),
    },
    foundingPricingTable('founding-pricing', false),
    {
      _key: 'founding-intro',
      _type: 'richText',
      align: 'center',
      content: pt(
        "Be a part of Treehouse from the very beginning! Founding Members are the families who believe in what we're building — and we're making it worth your while.",
        'Join before we open and lock in founding rates for three full years.',
      ),
    },
    {
      _key: 'cta-be-an-early-bird',
      _type: 'ctaBanner',
      heading: 'be an early bird',
      variant: 'inline',
      color: 'ocean',
      link: {
        label: 'be an early bird',
        // PLACEHOLDER: routes to email until the ROLLER signup flow exists.
        kind: 'external',
        href: 'mailto:fontaine@treehouseparkcity.com?subject=Founding%20membership',
        variant: 'solid-ocean',
      },
    },
    earlyBirdPerks('early-bird-perks'),
    {
      _key: 'render',
      _type: 'photoGallery',
      layout: 'single',
      images: [
        {
          // PLACEHOLDER: architectural render, to be replaced by photography after opening.
          url: '/images/treehouse-render.jpg',
          alt: 'Cutaway architectural render of the full Treehouse floor plan, showing the multi-level play structure, toddler area, and party rooms',
        },
      ],
    },
    // The 'connect with us' band and its contact copy moved into the site
    // footer, which renders on every route from app/layout.tsx.
  ],
};
