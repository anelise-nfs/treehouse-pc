import type { Page } from '@/types/content';
import { parkCity } from '../location';

/**
 * Frequently asked questions. The standard sub-page shape: topbar header,
 * pageHeader opener, content below — the same template /contact, /gift-cards
 * and /press use.
 *
 * The faqAccordion block declares an empty `sections`; lib/content.ts fills it
 * from content/faqs.ts, grouped and ordered. The questions are deliberately
 * not authored here — in Phase 2 they are their own Sanity documents, and a
 * page fixture holding copies of them would make that swap a shape change
 * rather than a source change.
 */
export const faqPage: Page = {
  _id: 'page.faq',
  _type: 'page',
  title: 'good questions',
  slug: 'faq',
  headerVariant: 'topbar',
  seo: {
    title: 'FAQ — Treehouse Park City',
    description:
      'Ages, prices, memberships, food, parties and safety at Treehouse Park City, the indoor play cafe at Kimball Junction.',
  },
  location: parkCity,
  blocks: [
    {
      _key: 'page-header',
      _type: 'pageHeader',
      // The two corners of the linen title column that stay clear of a
      // vertically centred h1, following /contact and /press. Flat shapes in
      // both: the column is short and a tall mark comes down into the title.
      decorations: [
        { doodle: '3plus', slot: 'top-right', color: 'ocean', size: 'sm' },
        { doodle: 'm-squig', slot: 'bottom-left', color: 'flamingo', size: 'sm', bleed: true },
      ],
      title: 'good questions',
      height: 'small',
      image: {
        // PLACEHOLDER: final photography pending. Shared with the other
        // sub-pages, which is visible to anyone moving between them.
        url: '/images/hero-play-structure.jpg',
        alt: '',
      },
    },
    {
      // No heading: the pageHeader above already names the page, and a second
      // heading repeating it would be the only thing between the title and the
      // first section.
      _key: 'faq',
      _type: 'faqAccordion',
      sections: [],
    },
  ],
};
