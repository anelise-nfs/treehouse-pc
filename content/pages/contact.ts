import type { Page } from '@/types/content';
import { parkCity } from '../location';
import { pt } from '../_portableText';

/**
 * Contact page. The shell only — the form itself is the next piece of work, and
 * the richText block below is standing in its place so the page has something
 * under its header in the meantime.
 *
 * The h1 is lowercase to match the rest of the site's voice ('hey, early
 * bird!', 'party with us'); the SEO title is sentence case because that is
 * where it reads as a label rather than as the brand speaking.
 */
export const contactPage: Page = {
  _id: 'page.contact',
  _type: 'page',
  title: 'drop us a line',
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
      title: 'drop us a line',
      height: 'small',
      image: {
        // PLACEHOLDER: final photography pending. Shared with /early-bird for
        // now, which is visible if a visitor moves between the two.
        url: '/images/hero-play-structure.jpg',
        alt: '',
      },
    },
    {
      _key: 'contact-form',
      _type: 'richText',
      align: 'center',
      // PLACEHOLDER: the form replaces this block. Kept as copy rather than an
      // empty section so the page is not a header over blank linen while the
      // client is reviewing the template.
      content: pt(
        "We'd love to hear from you — whether you have a question about memberships, want to talk about a party, or just want to know when we open.",
      ),
      subcopy: pt('A contact form will land here shortly.'),
    },
  ],
};
