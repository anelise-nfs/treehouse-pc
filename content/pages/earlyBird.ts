import type { Page } from '@/types/content';
import { parkCity } from '../location';
import { pt } from '../_portableText';
import {
  foundingMembershipSection,
  joinTheEmailClub,
  membershipAgreement,
  saleSoonLine,
} from '../shared/foundingMembership';
import { MEMBERSHIPS_ON_SALE } from '../launchPhase';

/** Opens the pitch in both versions. */
const openingParagraph =
  "We're selling a limited number of founding membership spots and they will go fast! Founding Members are the families who believe in what we're building — and we're making it worth your while.";

/**
 * The sale-status paragraph that closes the pitch. Both versions sit here
 * rather than one being edited in place on sale day, so switching LAUNCH_PHASE
 * is the whole change and the v1-b copy has already been read and approved.
 *
 * v1-a: nothing to buy, so it promises and points at the newsletter button
 * below. v1-b: the tier cards carry purchase buttons, so it says so.
 */
const salePitch = MEMBERSHIPS_ON_SALE
  ? 'Memberships are on sale now! Join before we open and lock in founding rates for three full years.'
  : saleSoonLine;

/**
 * Founding membership sales page. Copy follows early_bird_page.png, with the
 * mockup's standalone opening line now folded into the first paragraph of the
 * pitch: once the membership section stacked its own copy above the prices, the
 * two sat one under the other and said much the same thing twice.
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
  headerVariant: 'topbar',
  seo: {
    title: 'Founding memberships — Treehouse Park City',
    description:
      "We're selling a limited number of founding membership spots and they will go fast!",
  },
  location: parkCity,
  blocks: [
    {
      _key: 'page-header',
      _type: 'pageHeader',
      // Colours chosen against what follows rather than in isolation: the
      // block below this one carries a flamingo spiral and a sunshine
      // squiggle, so neither repeats here.
      decorations: [
        { doodle: '3plus', slot: 'top-right', color: 'mint', size: 'sm' },
        { doodle: '3stars', slot: 'bottom-left', color: 'ocean', size: 'sm', bleed: true },
      ],
      title: 'hey, early bird!',
      height: 'small',
      image: {
        // PLACEHOLDER: final photography pending.
        url: '/images/hero-play-structure.jpg',
        alt: '',
      },
    },
    foundingMembershipSection('founding-membership', {
      // No title band: the pageHeader above already names this page.
      //
      // One mark, not two. A flamingo rainbow briefly sat opposite this, having
      // moved off a richText block that was folded into the pitch below, but
      // between the page header's own doodles and the intro graphics the page
      // had more decoration than copy.
      decorations: [{ doodle: 'vertscribble', slot: 'top-right', color: 'sunshine' }],
      intro: pt(openingParagraph),
      // The terms someone is agreeing to, under the prices they are agreeing
      // to them for. Only here: the homepage shows the same tiers as a teaser
      // and sends people to this page to buy, so the agreement belongs at the
      // point of sale rather than beside every mention of a price.
      tiersFootnoteLink: membershipAgreement,
      // The status line moved out of `intro` into its own field so it renders
      // as a callout rather than as a second paragraph of the pitch.
      notice: pt(salePitch),
      // No primary button in either version: it would be 'be an early bird',
      // which links to /early-bird — the page you are already on.
      //
      // v1-a keeps the newsletter opt-in, the only thing there is to do here
      // while nothing is for sale. v1-b drops it: the three purchase buttons
      // on the tier cards are the action, and a fourth button competing with
      // them for a mailing list is the wrong ask once someone can just buy.
      ...(MEMBERSHIPS_ON_SALE ? {} : { secondaryCta: joinTheEmailClub }),
    }),
    {
      _key: 'render',
      _type: 'photoGallery',
      layout: 'single',
      // 'xs' is what this was before the scale gained a step; the name changed, the size did not.
      decorations: [{ doodle: '3stars', slot: 'top-right', color: 'mint', size: 'xs' }],
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
