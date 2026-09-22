import type { PartyPackage } from '@/types/content';
import { pt } from './_portableText';
import { parkCity } from './location';

/**
 * `includes` is empty on both packages: the mockups describe what is included
 * in prose rather than as a checklist. The field stays available for Phase 2.
 * Colors are PLACEHOLDER — the mockups show these as script headings on linen
 * with no color fill of their own.
 */
export const partyPackages: PartyPackage[] = [
  {
    _id: 'partyPackage.the-classic',
    _type: 'partyPackage',
    name: 'the classic',
    slug: 'the-classic',
    priceLine: '$25/child (parties start at $300)',
    duration: '2 hours',
    description: pt(
      "Your private party room and 2 hours of play, set up for you to make your own. Bring your food, cake, and decorations, and we'll take care of the space and the cleanup. Perfect for parents who have their theme dialed in.",
    ),
    includes: [],
    color: 'mint',
    location: parkCity,
  },
  {
    _id: 'partyPackage.the-works',
    _type: 'partyPackage',
    name: 'the works',
    slug: 'the-works',
    priceLine: '$50/child (parties start at $500)',
    duration: '2 hours',
    description: pt(
      "Your private party room and 2 hours of play — we handle the rest. Food, cake, and decorations are all taken care of, so you show up, celebrate, and leave the mess to us. Perfect for parents who'd rather just be present.",
    ),
    includes: [],
    color: 'flamingo',
    location: parkCity,
  },
];
