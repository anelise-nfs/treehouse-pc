/**
 * Founding-membership data, defined once and referenced by both launch pages.
 *
 * The tiers, perks and CTA are identical on the homepage and /early-bird, so a
 * price or perk change has to reach both. Keeping one source here is what
 * prevents drift, and it mirrors Phase 2, where both pages will reference the
 * same Sanity documents rather than carrying their own copies.
 *
 * Page-specific wording — each page's intro paragraphs and whether it shows a
 * title band — is passed in, not stored here.
 */
import type {
  BandColor,
  Decoration,
  Link,
  MembershipPerk,
  MembershipSectionBlock,
  PortableTextBlock,
} from '@/types/content';
import { foundingTiers } from '../pricing';

export const beAnEarlyBird: Link = {
  label: 'be an early bird',
  kind: 'internal',
  href: '/early-bird',
  variant: 'solid-ocean',
};

export const foundingFootnote =
  'Founding memberships are paid annually, up front — locking in your early bird rate and your spot.';

export const foundingPerksTitle = 'early birds get:';

export const foundingPerks: MembershipPerk[] = [
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
];

export interface FoundingMembershipOptions {
  /** Omitted on /early-bird, where the pageHeader already names the section. */
  title?: string;
  titleBandColor?: BandColor;
  /** Page-specific: the copy differs between the two pages. */
  intro: PortableTextBlock[];
  /** Page-specific decoration; the homepage carries doodles, /early-bird does not. */
  decorations?: Decoration[];
  /** In-page anchor target, so the footer can link to this section. */
  anchorId?: string;
}

export function foundingMembershipSection(
  key: string,
  { title, titleBandColor, intro, decorations, anchorId }: FoundingMembershipOptions,
): MembershipSectionBlock {
  return {
    _key: key,
    _type: 'membershipSection',
    ...(title ? { title, titleBandColor } : {}),
    tiers: foundingTiers,
    tiersFootnote: foundingFootnote,
    intro,
    cta: beAnEarlyBird,
    perksTitle: foundingPerksTitle,
    perks: foundingPerks,
    ...(decorations ? { decorations } : {}),
    ...(anchorId ? { anchorId } : {}),
  };
}
