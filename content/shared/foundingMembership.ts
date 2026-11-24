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
import { EARLY_BIRD_SECTION, rollerCheckout } from '../checkout';
import { foundingTiers } from '../pricing';

/**
 * The buttons the membership section shows under its copy, on the homepage.
 *
 * Defined here rather than at their call sites because a label is the kind of
 * thing that gets changed in one place and forgotten in the other, and because
 * the pair is part of the shared section rather than of either page.
 *
 * Outline, not solid: this sits beside the purchase button below, which takes
 * the solid treatment. The two never carry the same weight, and the button that
 * sells something should not be the quieter one.
 */
export const learnMore: Link = {
  label: 'learn more',
  kind: 'internal',
  href: '/early-bird',
  variant: 'outline-ocean',
};

/**
 * The purchase button, in the primary slot on both pages. One constant, so the
 * label and the destination cannot drift between the homepage teaser and the
 * sales page.
 *
 * Opens ROLLER's overlay on the early bird *section* rather than on a product,
 * which is the difference between this and the three 'join now' buttons on the
 * tier cards: this is for someone sold on the pitch who has not picked a size
 * yet, and it lands them on the range.
 *
 * Its `triggerId` repeats on both pages, which is correct — ids are unique
 * within a page, and analytics wants one series for one action, not two.
 */
export const becomeAFoundingMember: Link = {
  label: 'become a founding member',
  kind: 'checkout',
  href: rollerCheckout.checkoutUrl,
  checkout: {
    section: EARLY_BIRD_SECTION,
    triggerId: 'checkout-become-founding-member',
    ariaLabel: 'Become a founding member — open the early bird membership store',
  },
  variant: 'solid-ocean',
};

/**
 * The membership agreement, linked from under the prices.
 *
 * NO `variant`, which is what makes CtaLink render it as inline text rather
 * than a button (see the Link type). That is the point: it sits beneath the
 * billing footnote as the fine print it is, and a fourth button in this
 * section would compete with the three that actually sell something.
 *
 * Only /early-bird passes it. The page is noIndex and in no nav, so this is
 * the single route to it anywhere on the site — which is deliberate, and worth
 * knowing before anyone removes it.
 */
export const membershipAgreement: Link = {
  label: 'Early Bird Membership Agreement',
  kind: 'internal',
  href: '/early-bird-membership-agreement',
};

/**
 * The homepage's standing description of a founding member, and the whole of
 * its membership intro — the prices below it carry their own purchase buttons,
 * so nothing here has to announce that there is something to buy.
 */
export const foundingPitch =
  "Founding Members (aka early birds) are the families who believe in what we're building — and we're making it worth your while.";

export const foundingFootnote =
  'Prices listed are monthly. Founding memberships are paid annually up front, locking in your early bird rate and your spot.';

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

/**
 * What every membership includes, founding or not — rendered under its own
 * heading below the founding perks, not merged into them. The distinction is
 * the point: 'early birds get:' is the reason to buy now, this list is the
 * reason to buy at all.
 *
 * Lowercase to match the founding perks beside it and the rest of the site's
 * voice; the client's copy arrived sentence-capped.
 */
export const allMemberPerksTitle = 'all members will enjoy';

export const allMemberPerks: MembershipPerk[] = [
  {
    _key: 'skip-the-line-entry',
    label: 'skip-the-line entry',
    description: 'just scan your QR code and come on in',
  },
  {
    _key: 'discounted-classes',
    label: 'discounted classes',
    description: 'save on every class and workshop, all year long',
  },
  {
    _key: 'monthly-buddy-passes',
    label: 'monthly buddy passes',
    description: 'bring a friend along each month, on us',
  },
  {
    _key: 'unlimited-access',
    label: 'unlimited access',
    description: 'come and play as often as you like, whenever you like',
  },
];

export interface FoundingMembershipOptions {
  /** Omitted on /early-bird, where the pageHeader already names the section. */
  title?: string;
  titleBandColor?: BandColor;
  /** Page-specific: the copy differs between the two pages. */
  intro: PortableTextBlock[];
  /** The sale-status announcement, rendered as a callout. See the block type. */
  notice?: PortableTextBlock[];
  /** Page-specific decoration; the homepage carries doodles, /early-bird does not. */
  decorations?: Decoration[];
  /** In-page anchor target, so the footer can link to this section. */
  anchorId?: string;
  /**
   * The buttons under the intro copy, passed per page rather than fixed here:
   * the homepage shows 'be an early bird' and 'learn more', and /early-bird
   * shows neither — one would link to the page you are already on and the
   * other to a purchase its own tier cards already offer.
   *
   * Both optional, and the section renders no button row at all when neither
   * is given.
   */
  cta?: Link;
  secondaryCta?: Link;
  /** The agreement link under the billing footnote; /early-bird only. */
  tiersFootnoteLink?: Link;
}

export function foundingMembershipSection(
  key: string,
  {
    title,
    titleBandColor,
    intro,
    notice,
    decorations,
    anchorId,
    cta,
    secondaryCta,
    tiersFootnoteLink,
  }: FoundingMembershipOptions,
): MembershipSectionBlock {
  return {
    _key: key,
    _type: 'membershipSection',
    ...(title ? { title, titleBandColor } : {}),
    tiers: foundingTiers,
    tiersFootnote: foundingFootnote,
    ...(tiersFootnoteLink ? { tiersFootnoteLink } : {}),
    intro,
    ...(notice ? { notice } : {}),
    ...(cta ? { cta } : {}),
    ...(secondaryCta ? { secondaryCta } : {}),
    perksTitle: foundingPerksTitle,
    perks: foundingPerks,
    memberPerksTitle: allMemberPerksTitle,
    memberPerks: allMemberPerks,
    ...(decorations ? { decorations } : {}),
    ...(anchorId ? { anchorId } : {}),
  };
}
