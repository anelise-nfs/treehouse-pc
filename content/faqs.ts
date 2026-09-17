import type { FaqItem } from '@/types/content';
import { pt } from './_portableText';
import { parkCity } from './location';

/**
 * PLACEHOLDER — every item below is invented. Neither launch page renders an
 * faqAccordion, and the mockups contain no FAQ copy. These exist so the type
 * and the accessor are exercised, and so there is something for Fontaine to
 * edit rather than a blank slate. Replace wholesale before any FAQ ships.
 */
export const faqs: FaqItem[] = [
  {
    _id: 'faqItem.what-ages',
    _type: 'faqItem',
    question: 'What ages is Treehouse for?', // PLACEHOLDER
    answer: pt('Treehouse is built for kids ages 0–12.'), // PLACEHOLDER
    category: 'visiting',
    order: 1,
    location: parkCity,
  },
  {
    _id: 'faqItem.adult-supervision',
    _type: 'faqItem',
    question: 'Do I need to stay with my child?', // PLACEHOLDER
    answer: pt('Yes — Treehouse is a come-and-stay space, and every child needs an adult on site.'), // PLACEHOLDER
    category: 'visiting',
    order: 2,
    location: parkCity,
  },
  {
    _id: 'faqItem.membership-commitment',
    _type: 'faqItem',
    question: 'How long is a membership commitment?', // PLACEHOLDER
    answer: pt('Founding memberships are paid annually, up front.'), // PLACEHOLDER
    category: 'membership',
    order: 3,
    location: parkCity,
  },
];
