import type { PressItem } from '@/types/content';

/**
 * Press coverage, newest first.
 *
 * Order is not maintained by hand: lib/content.ts sorts on `date` so a new
 * item can be appended anywhere in this array. In Phase 2 these become Sanity
 * documents and the same sort becomes the GROQ `order()` clause.
 *
 * `date` is 'YYYY-MM-DD' where the outlet published on a known day, and
 * 'YYYY-MM' where it dates the piece only to the month. The TownLift article
 * below is the second kind — its URL carries /2026/09/ and nothing finer, and
 * inventing a day to make the field uniform would put a date on the page that
 * no one published.
 */
export const pressItems: PressItem[] = [
  {
    _id: 'pressItem.kpcw-mountain-money',
    _type: 'pressItem',
    outlet: 'KPCW — Mountain Money',
    headline:
      'How this Parkite transformed an empty Best Buy into an indoor jungle gym',
    date: '2026-11-02',
    url: 'https://www.kpcw.org/podcast/mountain-money/2026-11-02/how-this-parkite-transformed-an-empty-best-buy-into-an-indoor-jungle-gym',
  },
  {
    _id: 'pressItem.townlift-kimball-junction',
    _type: 'pressItem',
    outlet: 'TownLift',
    headline:
      'Treehouse Park City indoor playground and cafe coming to Kimball Junction this winter',
    date: '2026-09',
    url: 'https://townlift.com/2026/09/treehouse-park-city-indoor-playground-and-cafe-coming-to-kimball-junction-this-winter/',
  },
];
