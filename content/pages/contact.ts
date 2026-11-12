import type { Page } from '@/types/content';
import { parkCity } from '../location';
import { pt } from '../_portableText';

/**
 * Contact page.
 *
 * No contact form: the page offers the business's email address as a link,
 * and a mailing-list signup. Those are two different things on two different
 * endpoints — see lib/forms.ts — and the signup is not a way to get in touch.
 *
 * The h1 is lowercase to match the rest of the site's voice ('hey, early
 * bird!', 'party with us'); the SEO title is sentence case because that is
 * where it reads as a label rather than as the brand speaking.
 *
 * `title` and the pageHeader's `title` are deliberately the same string: one
 * names the document, the other is the heading a visitor reads, and there is
 * no reason for them to differ here.
 */
export const contactPage: Page = {
  _id: 'page.contact',
  _type: 'page',
  title: 'stay in touch',
  slug: 'contact',
  headerVariant: 'topbar',
  seo: {
    title: 'Contact — Treehouse Park City',
    description:
      "Questions about memberships, parties, or visiting? Get in touch with Treehouse Park City.",
    noIndex: true,
  },
  location: parkCity,
  blocks: [
    {
      _key: 'page-header',
      _type: 'pageHeader',
      // Top-right and bottom-left, the two corners of the linen column that
      // sit clear of a vertically centred title. The top one is a flat shape
      // on purpose: the column is short, and a tall mark in that corner comes
      // down into the h1.
      decorations: [
        { doodle: 'm-squig', slot: 'top-right', color: 'sky', size: 'sm' },
        { doodle: 'rainbow', slot: 'bottom-left', color: 'sunshine', size: 'sm', bleed: true },
      ],
      title: 'stay in touch',
      height: 'small',
      image: {
        // PLACEHOLDER: final photography pending. Shared with /early-bird for
        // now, which is visible if a visitor moves between the two.
        url: '/images/hero-play-structure.jpg',
        alt: '',
      },
    },
    {
      // The form is gone; the mailto in the intro below is now the only way to
      // reach the business from this page, so that link is load-bearing rather
      // than a convenience. The signup underneath is the mailing list, which
      // is a separate thing on a separate endpoint — see lib/forms.ts.
      _key: 'newsletter',
      _type: 'newsletterSignup',
      heading: 'say hello',
      intro: pt(
        "We'd love to hear from you — whether you have a question about memberships, want to talk about a party, or just want to know more.",
        // Second paragraph, and a real mailto rather than an address to
        // retype. The same address as the footer's; it is not pulled from
        // SiteSettings because it is part of a sentence, and splitting a
        // sentence between the content and the settings would leave neither
        // editable on its own.
        [
          'You can also contact us by email at ',
          { text: 'holler@treehouseparkcity.com', href: 'mailto:holler@treehouseparkcity.com' },
          '.',
        ],
      ),
    },
  ],
};
