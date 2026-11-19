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

/**
 * The buttons the membership section can show under its copy. Which pair each
 * page uses depends on LAUNCH_PHASE; see content/launchPhase.ts for the table.
 *
 * All three are defined here rather than at their call sites because the two
 * pages share them, and because a label is the kind of thing that gets changed
 * in one place and forgotten in the other.
 *
 * Solid is the primary slot and outline the lesser one — the two never carry
 * the same weight.
 */
export const learnMore: Link = {
  label: 'learn more',
  kind: 'internal',
  href: '/early-bird',
  variant: 'solid-ocean',
};

/**
 * The same link in the lesser slot, for v1-b. There it sits beside 'be an
 * early bird', which goes to the product page — the action worth the solid
 * treatment once there is something to buy. Two constants rather than a
 * variant argument because a Link carries its own styling, and spreading an
 * override at the call site hides which button is the primary one.
 */
export const learnMoreSecondary: Link = { ...learnMore, variant: 'outline-ocean' };

/**
 * v1-b only, on the homepage. PLACEHOLDER: points at '#' until the ROLLER
 * product page exists, which is also when this button first renders — so the
 * dead href can never reach the live site, which ships as v1-a.
 *
 * Swap alongside PLACEHOLDER_CTA in content/pricing.ts; both are listed as
 * remaining v1-b work in content/launchPhase.ts.
 */
export const beAnEarlyBird: Link = {
  label: 'be an early bird',
  kind: 'anchor',
  href: '#',
  variant: 'solid-ocean',
};

/**
 * Opens the signup dialog, like the hero's button — the mailing list has one
 * UI and one endpoint wherever it is offered. The href is the no-JavaScript
 * fallback, pointing at the footer's copy.
 */
export const joinTheEmailClub: Link = {
  label: 'join the email club',
  kind: 'newsletter',
  href: '#newsletter',
  variant: 'outline-ocean',
};

/**
 * The v1-a sale-status line, shared by both pages so the promise is worded
 * identically wherever someone meets it. It closes each page's intro copy and
 * disappears in v1-b, where there is a purchase button instead of a promise.
 */
export const saleSoonLine =
  'Memberships will go on sale soon. Sign up for email updates to be the first to know!';

/**
 * The homepage's standing description of a founding member. It is the whole
 * intro in v1-b and the first paragraph of it in v1-a.
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
  /** Page-specific decoration; the homepage carries doodles, /early-bird does not. */
  decorations?: Decoration[];
  /** In-page anchor target, so the footer can link to this section. */
  anchorId?: string;
  /**
   * The buttons under the intro copy, chosen per page and per launch phase
   * rather than fixed here — /early-bird shows one in v1-a and none in v1-b,
   * the homepage shows two in both but swaps the second.
   *
   * Both optional, and the section renders no button row at all when neither
   * is given, which is what /early-bird wants in v1-b.
   */
  cta?: Link;
  secondaryCta?: Link;
}

export function foundingMembershipSection(
  key: string,
  {
    title,
    titleBandColor,
    intro,
    decorations,
    anchorId,
    cta,
    secondaryCta,
  }: FoundingMembershipOptions,
): MembershipSectionBlock {
  return {
    _key: key,
    _type: 'membershipSection',
    ...(title ? { title, titleBandColor } : {}),
    tiers: foundingTiers,
    tiersFootnote: foundingFootnote,
    intro,
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
