import type { Page } from '@/types/content';
import { parkCity } from '../location';
import { pt } from '../_portableText';
import { foundingMembershipSection } from '../shared/foundingMembership';

/**
 * Founding membership sales page. Copy is verbatim from early_bird_page.png.
 *
 * The founding tiers, perks and CTA come from content/shared/foundingMembership,
 * which the homepage also uses, so a price or perk change reaches both pages.
 * Only the intro copy below is specific to this page.
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
      title: 'hey, early bird!',
      height: 'small',
      image: {
        // PLACEHOLDER: final photography pending.
        url: '/images/hero-play-structure.jpg',
        alt: '',
      },
    },
    {
      _key: 'intro',
      _type: 'richText',
      align: 'center',
      decorations: [{ doodle: 'rainbow', slot: 'top-left', color: 'flamingo' }],
      content: pt(
        "We're selling a limited number of founding membership spots and they will go fast!",
      ),
    },
    foundingMembershipSection('founding-membership', {
      // No title band: the pageHeader above already names this page.
      decorations: [{ doodle: 'vertscribble', slot: 'top-right', color: 'sunshine' }],
      intro: pt(
        "Be a part of Treehouse from the very beginning! Founding Members are the families who believe in what we're building — and we're making it worth your while.",
        'Join before we open and lock in founding rates for three full years.',
      ),
    }),
    {
      _key: 'render',
      _type: 'photoGallery',
      layout: 'single',
      decorations: [{ doodle: '3stars', slot: 'top-right', color: 'mint' }],
      images: [
        {
          // The client's floor-plan render. Not photography; to be replaced after opening.
          url: '/images/playarea_aerial.png',
          alt: 'Cutaway architectural render of the full Treehouse floor plan, showing the multi-level play structure, toddler area, and party rooms',
        },
      ],
    },
    // The 'connect with us' band and its contact copy moved into the site
    // footer, which renders on every route from app/layout.tsx.
  ],
};
