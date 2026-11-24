/**
 * The membership section, and the data it shows.
 *
 * SOLD OUT. The founding ('early bird') memberships this module was built for
 * are gone, and /early-bird with them. What renders now is the standard rates
 * that take effect at opening, with no purchase button — there is nothing to
 * buy until the doors open — and a single perk list covering what every
 * membership includes.
 *
 * It had two callers and now has one, the homepage. It was
 * content/shared/foundingMembership.ts, exporting foundingMembershipSection(),
 * until the sale closed and neither name described it any more.
 *
 * `membershipSection()` is the content-side factory that builds a
 * MembershipSectionBlock; components/blocks/MembershipSection.tsx is the
 * component that renders one. Same noun on both sides of the content/component
 * boundary, which is the arrangement everywhere else in /content/.
 *
 * Page-specific wording — the intro paragraphs and whether it shows a title
 * band — is passed in, not stored here.
 */
import type {
  BandColor,
  Decoration,
  Link,
  MembershipPerk,
  MembershipSectionBlock,
  PortableTextBlock,
} from '@/types/content';
import { standardTiers } from '../pricing';

/**
 * The two buttons the membership section shows under its copy.
 *
 * Defined here rather than at the call site because a label is the kind of
 * thing that gets changed in one place and forgotten in the other.
 *
 * THE MAILING LIST TAKES THE SOLID SLOT. With the founding memberships gone
 * there is no membership to sell until opening, so hearing when regular ones
 * go on sale is the most useful thing a visitor can do here — and it is what
 * the copy above the buttons asks for. The gift card is the outline: a real
 * purchase, but not the one this section is about.
 *
 * Both lowercase, matching 'drop-in play' and the rest of the section's voice.
 * The button on /gift-cards reads 'Buy a gift card' because that page is set
 * in Title Case throughout.
 */
export const signUpForUpdates: Link = {
  label: 'sign up for updates',
  // Opens the signup dialog like every other mailing-list link on the site;
  // the href is the no-JavaScript fallback to the footer's form.
  kind: 'newsletter',
  href: '#newsletter',
  variant: 'solid-ocean',
};

/**
 * A plain navigation link to /gift-cards, NOT a checkout trigger. The overlay
 * belongs to the button on that page, next to the copy explaining what a gift
 * card covers; opening a payment overlay straight off the homepage skips the
 * part where someone finds out what they are buying.
 */
export const buyAGiftCard: Link = {
  label: 'buy a gift card',
  kind: 'internal',
  href: '/gift-cards',
  variant: 'outline-ocean',
};

/**
 * The membership agreement.
 *
 * CURRENTLY LINKED FROM NOWHERE, AND DELIBERATELY STILL HERE. /early-bird was
 * the only page that passed it, and that page is gone — so the agreement at
 * /early-bird-membership-agreement is now an orphan: the page still resolves,
 * but nothing on the site points at it.
 *
 * That is a live question rather than a settled one. People who bought a
 * founding membership are party to this document and may need to read it
 * again, and the obvious home for it is the footer's legal row beside Privacy
 * and Terms. Wiring it there is one entry in content/site.ts's `legalNav`.
 *
 * Kept defined so that stays a one-line change. NO `variant`, which is what
 * makes CtaLink render it as inline text rather than a button.
 */
export const membershipAgreement: Link = {
  label: 'Early Bird Membership Agreement',
  kind: 'internal',
  href: '/early-bird-membership-agreement',
};

/**
 * What every membership includes — the only perk list now. The founding-only
 * list that sat above it ('early birds get:') went with the sale: every item
 * on it was a founding exclusive, so none of it survives the change-over.
 *
 * Lowercase to match the rest of the site's voice; the client's copy arrived
 * sentence-capped.
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

export interface MembershipSectionOptions {
  /** The title band's text. Omitted leaves the section opening on its copy. */
  title?: string;
  titleBandColor?: BandColor;
  /** Page-specific, so the section itself holds no sale-status wording. */
  intro: PortableTextBlock[];
  /** The sale-status announcement, rendered as a callout. See the block type. */
  notice?: PortableTextBlock[];
  /** Page-specific decoration. */
  decorations?: Decoration[];
  /** In-page anchor target, so the footer can link to this section. */
  anchorId?: string;
  /**
   * The buttons under the intro copy, passed in rather than fixed here. The
   * homepage shows 'sign up for updates' and 'buy a gift card'.
   *
   * Both optional, and the section renders no button row at all when neither
   * is given.
   */
  cta?: Link;
  secondaryCta?: Link;
  /**
   * A quiet link under the billing fine print. Nothing passes it now — the
   * fine print it belonged under described founding annual billing and went
   * with the sale. See `membershipAgreement` above.
   */
  tiersFootnoteLink?: Link;
}

export function membershipSection(
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
  }: MembershipSectionOptions,
): MembershipSectionBlock {
  return {
    _key: key,
    _type: 'membershipSection',
    ...(title ? { title, titleBandColor } : {}),
    // The standard rates, which are what a visitor can actually get now. These
    // are the figures the founding cards used to strike through, and they
    // carry no compareAtAmount, no annual total and no purchase button —
    // see content/pricing.ts.
    tiers: standardTiers,
    // No tiersFootnote. It explained that founding memberships were billed
    // annually up front, which is not how a standard membership works and not
    // a thing anyone can buy here today.
    ...(tiersFootnoteLink ? { tiersFootnoteLink } : {}),
    intro,
    ...(notice ? { notice } : {}),
    ...(cta ? { cta } : {}),
    ...(secondaryCta ? { secondaryCta } : {}),
    // One list, in the first slot. `memberPerks` is the optional second slot
    // and stays empty: there is no founding/standard distinction left to draw,
    // and two identically styled lists would imply one.
    perksTitle: allMemberPerksTitle,
    perks: allMemberPerks,
    ...(decorations ? { decorations } : {}),
    ...(anchorId ? { anchorId } : {}),
  };
}
