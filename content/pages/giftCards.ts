import type { Link, Page } from '@/types/content';
import { parkCity } from '../location';
import { pt } from '../_portableText';
import { GIFT_CARD_SECTION, rollerCheckout } from '../checkout';

/**
 * The gift-card purchase button.
 *
 * Page-local rather than shared: this is the only button that opens the
 * gift-card overlay, and the links in content/shared/membership.ts are there
 * because they belong to a section rather than to a page. A constant anyway,
 * so the label, the target and the fallback stay next to each other.
 *
 * NOT the same thing as `buyAGiftCard` in that module, which is the plain
 * navigation link the homepage uses to send someone here. This is the purchase.
 *
 * Opens ROLLER's overlay on the gift-card section — see GIFT_CARD_SECTION for
 * why that string is singular. `href` is the store it falls through to if the
 * widget has not loaded; see components/CheckoutTrigger.tsx.
 */
const buyAGiftCard: Link = {
  label: 'Buy a gift card',
  kind: 'checkout',
  href: rollerCheckout.checkoutUrl,
  checkout: {
    section: GIFT_CARD_SECTION,
    triggerId: 'checkout-buy-gift-card',
    // Unlike the three 'join now' buttons, this label is unambiguous on its
    // own. It still names the destination, so the accessible name says the
    // click opens a store rather than loading a page.
    ariaLabel: 'Buy a gift card — open the Treehouse gift card store',
  },
  variant: 'solid-ocean',
};

/**
 * Gift cards. The standard sub-page shape — topbar header, pageHeader opener,
 * content below — the same template /faq, /privacy and /terms use.
 *
 * Title Case, following /press ('In the News') and the legal pages rather than
 * the lowercase voice of /faq ('good questions') and /contact ('stay in
 * touch'). 'Gift Cards' is the product's name, and the footer link reads the
 * same.
 *
 * One of the three routes that loads ROLLER's widget — see
 * app/gift-cards/page.tsx.
 */
export const giftCardsPage: Page = {
  _id: 'page.gift-cards',
  _type: 'page',
  title: 'Gift Cards',
  slug: 'gift-cards',
  headerVariant: 'topbar',
  seo: {
    title: 'Gift Cards — Treehouse Park City',
    description:
      'Give the gift of play. A Treehouse gift card works for day passes, memberships, classes and birthday parties at our Park City indoor play cafe.',
  },
  location: parkCity,
  blocks: [
    {
      _key: 'page-header',
      _type: 'pageHeader',
      // The two corners of the linen title column that stay clear of a
      // vertically centred h1, following /faq, /contact and /press. Flat
      // shapes in both: the column is short and a tall mark comes down into
      // the title.
      //
      // Tomato and lime because the other three sub-page headers have taken
      // ocean/flamingo, sky/sunshine and mint/ocean, and a visitor moving
      // between them should not meet the same pair twice.
      decorations: [
        { doodle: '3plus', slot: 'top-right', color: 'tomato', size: 'sm' },
        { doodle: 'rainbow', slot: 'bottom-left', color: 'lime', size: 'sm', bleed: true },
      ],
      title: 'Gift Cards',
      height: 'small',
      image: {
        // PLACEHOLDER: final photography pending. Shared with the other
        // sub-pages, which is visible to anyone moving between them.
        url: '/images/hero-play-structure.jpg',
        alt: '',
      },
    },
    {
      // No heading: the pageHeader above already names the page.
      _key: 'gift-cards-intro',
      _type: 'richText',
      align: 'center',
      // PLACEHOLDER COPY — awaiting Fontaine. Deliberately claims nothing
      // about expiry, refunds or transferability: those are gift-card terms,
      // they are not settled, and a marketing page is not where to invent
      // them.
      //
      // Two paragraphs, which is how the line break is carried: portable text
      // has no inline break, and the opening line is meant to land on its own.
      // The gap is --spacing-block, the same step between any two paragraphs
      // in this block.
      content: pt(
        'Give the gift of play.',
        'A Treehouse gift card can go toward day passes, memberships, classes and workshops, a birthday party, or just a really good coffee while the kids climb.',
      ),
      // subcopy, matching the party and classes blocks on the homepage: a note
      // about timing, set smaller and muted rather than as body copy. It sits
      // above the button, which is where RichText puts it.
      subcopy: pt('Gift cards can be redeemed upon opening.'),
      cta: buyAGiftCard,
    },
    // The 'connect with us' band and its contact copy live in the site footer,
    // which renders on every route from app/layout.tsx.
  ],
};
