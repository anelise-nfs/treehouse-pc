/**
 * Blocks that appear verbatim on both launch pages. Written as factories
 * because every block needs its own `_key` within the page that holds it.
 */
import type {
  DividerBlock,
  MembershipSectionBlock,
  PerksListBlock,
  PricingTableBlock,
  RichTextBlock,
} from '@/types/content';
import { foundingTiers } from '../pricing';
import { pt, ptLink, h3 } from '../_portableText';

export function foundingPricingTable(key: string, cta = true): PricingTableBlock {
  return {
    _key: key,
    _type: 'pricingTable',
    tiers: foundingTiers,
    footnote:
      'Founding memberships are paid annually, up front — locking in your early bird rate and your spot.',
    ...(cta
      ? {
          cta: {
            label: 'be an early bird',
            kind: 'internal' as const,
            href: '/early-bird',
            variant: 'solid-ocean' as const,
          },
        }
      : {}),
  };
}

/**
 * The founding-membership section as one block. Supersedes the separate
 * foundingPricingTable + founding-intro + earlyBirdPerks trio on the homepage;
 * the early-bird page still composes those individually.
 */
export function earlyBirdMembership(key: string): MembershipSectionBlock {
  return {
    _key: key,
    _type: 'membershipSection',
    title: 'early bird gets the worm',
    titleBandColor: 'tangerine',
    tiers: foundingTiers,
    tiersFootnote:
      'Founding memberships are paid annually, up front — locking in your early bird rate and your spot.',
    intro: pt(
      "Founding Members (aka early birds) are the families who believe in what we're building — and we're making it worth your while.",
    ),
    cta: {
      label: 'be an early bird',
      kind: 'internal',
      href: '/early-bird',
      variant: 'solid-ocean',
    },
    perksTitle: 'early birds get:',
    perks: [
      {
        _key: 'best-rates',
        label: 'best rates',
        description:
          'early bird rates locked in for three years paid up front in year one, can go monthly after',
      },
      {
        _key: 'the-first-play',
        label: 'the first play',
        description:
          'invite to an exclusive pre-opening play party before we open our doors to the public',
      },
      {
        _key: 'sick-merch',
        label: 'sick merch',
        description: 'special Treehouse swag to wear proudly',
      },
      {
        _key: 'badge-of-honor',
        label: 'badge of honor',
        description: "early bird status for life — you were here first, and we won't forget it",
      },
    ],
  };
}

export function earlyBirdPerks(key: string): PerksListBlock {
  return {
    _key: key,
    _type: 'perksList',
    heading: 'early birds get:',
    variant: 'checklist',
    items: [
      {
        _key: 'best-rates',
        title: 'best rates',
        body: 'early bird rates locked in for three years paid up front in year one, can go monthly after',
      },
      {
        _key: 'the-first-play',
        title: 'the first play',
        body: 'invite to an exclusive pre-opening play party before we open our doors to the public',
      },
      {
        _key: 'sick-merch',
        title: 'sick merch',
        body: 'special Treehouse swag to wear proudly',
      },
      {
        _key: 'badge-of-honor',
        title: 'badge of honor',
        body: "early bird status for life — you were here first, and we won't forget it",
      },
    ],
  };
}

/**
 * Email and phone carry link annotations rather than being plain text, so they
 * are tappable on a phone. The mockups render them as plain strings.
 */
export function contactCopy(key: string): RichTextBlock {
  return {
    _key: key,
    _type: 'richText',
    align: 'center',
    content: [
      ...pt('Questions? Ideas? Thoughts?', 'Want to partner? Want to franchise?', h3('drop us a line')),
      ptLink('fontaine@treehouseparkcity.com', 'mailto:fontaine@treehouseparkcity.com'),
      ptLink('(415) 860-3698', 'tel:+14158603698'),
    ],
  };
}

export function checkerboardDivider(key: string): DividerBlock {
  return { _key: key, _type: 'divider', shape: 'checkerboard', size: 'md' };
}
