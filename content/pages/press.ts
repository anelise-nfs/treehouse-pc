import type { Page } from '@/types/content';
import { parkCity } from '../location';
import { pt } from '../_portableText';

/**
 * Press coverage. The standard sub-page shape: topbar header, pageHeader
 * opener, content below — the same template /contact and /early-bird use.
 *
 * The pressList block below declares an empty `items`; lib/content.ts fills it
 * from content/press.ts, sorted. The items are deliberately not authored here
 * — in Phase 2 they are their own Sanity documents, and a page fixture holding
 * copies of them would make that swap a shape change rather than a source
 * change.
 *
 * The h1 is title case where the rest of the site is lowercase: this one is a
 * section name rather than the brand speaking, and 'In the News' is how it
 * reads in the footer beside it.
 */
export const pressPage: Page = {
  _id: 'page.press',
  _type: 'page',
  title: 'In the News',
  slug: 'press',
  headerVariant: 'topbar',
  seo: {
    title: 'In the News — Treehouse Park City',
    description:
      'Press coverage of Treehouse Park City, the indoor play cafe coming to Kimball Junction.',
    // Matches every other page on the site until launch.
    noIndex: true,
  },
  location: parkCity,
  blocks: [
    {
      _key: 'page-header',
      _type: 'pageHeader',
      // The two corners of the linen title column that stay clear of a
      // vertically centred h1, following /contact. Flat shapes in both: the
      // column is short and a tall mark comes down into the title.
      decorations: [
        { doodle: 'm-squig', slot: 'top-right', color: 'flamingo', size: 'sm' },
        { doodle: '3stars', slot: 'bottom-left', color: 'sunshine', size: 'sm', bleed: true },
      ],
      title: 'In the News',
      height: 'small',
      image: {
        // PLACEHOLDER: final photography pending. Shared with /contact and
        // /early-bird, which is visible to anyone moving between them.
        url: '/images/hero-play-structure.jpg',
        alt: '',
      },
    },
    {
      // No heading: the pageHeader above already says 'In the News', and a
      // second heading repeating it would be the only thing between the title
      // and the first article.
      _key: 'press-list',
      _type: 'pressList',
      items: [],
    },
    {
      // Media contact, last on the page: someone reaching it has read the
      // coverage and is deciding whether to add to it.
      //
      // A real mailto rather than an address to retype, and the address is
      // written here rather than pulled from `parkCity.email` for the same
      // reason /contact writes it inline — it is part of a sentence, and
      // splitting a sentence between the content and the settings would leave
      // neither editable on its own.
      _key: 'press-contact',
      _type: 'richText',
      align: 'center',
      heading: 'press inquiries',
      // Ocean, the blue already approved for script headings on linen at
      // 3.44:1. Mint was the other candidate and is 3.01:1 — over the
      // large-text bar by 0.01, which is not a margin.
      headingColor: 'ocean',
      content: pt([
        'Working on a story about Treehouse Park City? For more information or to request an interview, email ',
        { text: 'holler@treehouseparkcity.com', href: 'mailto:holler@treehouseparkcity.com' },
        '.',
      ]),
    },
  ],
};
