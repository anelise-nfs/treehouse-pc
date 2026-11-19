import type { FaqCategory, FaqItem, ScriptHeadingColor } from '@/types/content';
import { pt } from './_portableText';
import { parkCity } from './location';
import { dropInBadges } from './dropIn';
import { standardTiers } from './pricing';

/**
 * The FAQ, as supplied by the client.
 *
 * PRICES ARE DERIVED, NOT TYPED. Every figure below is read out of the same
 * arrays the rest of the site renders — content/dropIn.ts for drop-in play and
 * the standard tiers in content/pricing.ts for membership. A price quoted in
 * prose is the one most likely to be forgotten when the real one changes, and
 * the FAQ is where someone checks a number before they drive over.
 *
 * The membership figures are the STANDARD rates, which is what these answers
 * describe. The founding rates on the homepage are lower and currently
 * struck through against exactly these numbers.
 */

/** A drop-in price by badge key, so a renamed badge fails loudly rather than silently. */
function dropIn(key: string): string {
  const badge = dropInBadges.find((candidate) => candidate._key === key);
  if (!badge) throw new Error(`[faqs] No drop-in badge '${key}'. See content/dropIn.ts.`);
  return badge.price;
}

/** A standard monthly membership rate by tier name, for the same reason. */
function monthly(name: string): string {
  const tier = standardTiers.find((candidate) => candidate.name === name);
  if (!tier) throw new Error(`[faqs] No standard tier '${name}'. See content/pricing.ts.`);
  return `$${tier.amount}`;
}

/**
 * Section headings, in the order they render.
 *
 * Lowercase, matching every other in-page heading on the site. The client's
 * note listed them title case; the voice here is the site's.
 */
export const faqSections: {
  category: FaqCategory;
  title: string;
  titleColor: ScriptHeadingColor;
}[] = [
  // A different colour per section, ordered so no two neighbours sit near each
  // other on the wheel. All five are on the approved script-heading list and
  // clear the 3:1 large-text bar on linen at the size the accordion sets:
  // pine 6.42, tangerine 4.50, ocean 3.44, tomato 3.72, lime 3.02.
  //
  // Lime is the thin one — over the bar by 0.02. It holds only because the
  // script face floors at 28px. If these headings ever shrink below that, lime
  // is the first thing that breaks.
  { category: 'visiting', title: 'visiting', titleColor: 'pine' },
  { category: 'membership', title: 'pricing + membership', titleColor: 'tangerine' },
  { category: 'cafe', title: 'food + drink', titleColor: 'ocean' },
  { category: 'parties', title: 'parties + classes', titleColor: 'tomato' },
  { category: 'safety', title: 'health + safety', titleColor: 'lime' },
];

export const faqs: FaqItem[] = [
  /* --- visiting ---------------------------------------------------------- */
  {
    _id: 'faqItem.ages',
    _type: 'faqItem',
    question: 'What ages is Treehouse for?',
    answer: pt('Treehouse is designed for children ages 0–12 and the grown-ups who love them.'),
    category: 'visiting',
    order: 1,
    location: parkCity,
  },
  {
    _id: 'faqItem.bigger-kids',
    _type: 'faqItem',
    question: 'Is there anything for bigger kids?',
    answer: pt(
      'Absolutely! We haven’t forgotten the big kids! We’re dreaming up Treehouse After Dark: think laser tag, a golf simulator, pizza parties, and more. It’s still in development, so stay tuned — this one’s going to be fun!',
    ),
    category: 'visiting',
    order: 2,
    location: parkCity,
  },
  {
    _id: 'faqItem.drop-off',
    _type: 'faqItem',
    question: 'Can I drop my kids off?',
    answer: pt(
      'Treehouse is not a drop-off facility for general play; a parent or caregiver stays with their little ones. For certain classes, events, and parties, drop-off may be available — we’ll always let you know when that’s the case.',
    ),
    category: 'visiting',
    order: 3,
    location: parkCity,
  },
  {
    _id: 'faqItem.age-areas',
    _type: 'faqItem',
    question: 'Are there separate areas for different ages?',
    answer: pt(
      'Yes! We have a dedicated zone just for our littlest guests, up to 3 years old, so babies and toddlers have a safe, cozy space to explore at their own pace — while the bigger kids climb, build, and adventure in areas made for them.',
    ),
    category: 'visiting',
    order: 4,
    location: parkCity,
  },
  {
    _id: 'faqItem.reservations',
    _type: 'faqItem',
    question: 'Do I need a reservation, or can I just show up?',
    answer: pt(
      'You’re welcome to drop in when space allows — on busier days or during peak times, we may use timed entry to keep things comfortable. Members enjoy skip-the-line entry.',
    ),
    category: 'visiting',
    order: 5,
    location: parkCity,
  },
  {
    _id: 'faqItem.parking',
    _type: 'faqItem',
    question: 'Is there parking?',
    answer: pt(
      'Yes! There’s a parking garage right under the building, accessed from the back parking lot. Take the stairs or the elevator up, and you’ll come out right outside our front door — easy in, easy out, even with little ones and strollers in tow.',
    ),
    category: 'visiting',
    order: 6,
    location: parkCity,
  },
  {
    _id: 'faqItem.hours',
    _type: 'faqItem',
    question: 'What are your hours?',
    answer: pt(
      'We know you’ve been up since the crack of dawn — so we will be too. We’re planning to open 8am–7pm, 7 days a week, with some seasonal shifts and the occasional bonus late-night hours. (Treehouse After Dark, anyone?)',
    ),
    category: 'visiting',
    order: 7,
    location: parkCity,
  },
  {
    _id: 'faqItem.location',
    _type: 'faqItem',
    question: 'Where are you located?',
    answer: pt(
      'We’re at Kimball Junction in Park City, Utah, in the old Best Buy building: 1209 Center Drive, Park City UT 84098.',
    ),
    category: 'visiting',
    order: 8,
    location: parkCity,
  },

  /* --- pricing & membership ---------------------------------------------- */
  {
    _id: 'faqItem.cost',
    _type: 'faqItem',
    question: 'How much does it cost to visit?',
    // The client's copy set the two price lists as bullets. PortableText
    // declares `listItem` but its renderer has no list branch, so these are
    // paragraphs instead of silently flattened list items.
    answer: pt(
      `Drop-in play is ${dropIn('little-kid')} per child up to 3 years old and ${dropIn(
        'big-kid',
      )} per child ages 4 and up. Under 1 is free with a paying sibling.`,
      `Memberships include unlimited play plus perks: ${monthly('one kid')}/month for one child, ${monthly(
        'two kids',
      )}/month for two, and ${monthly(
        'three+ kids',
      )}/month for three or more — the third, fourth, or fifth kid plays free!`,
      'Memberships can be paid up front for the year or billed monthly, with a one-year commitment. Life happens — so members can pause their membership for up to 3 months if they need to.',
    ),
    category: 'membership',
    order: 1,
    location: parkCity,
  },
  {
    _id: 'faqItem.early-bird-sell-out',
    _type: 'faqItem',
    question: 'What happens when Early Bird memberships sell out?',
    answer: pt(
      'Our Early Bird memberships are limited — once they’re gone, they’re gone! After they sell out, we’ll offer our regular memberships when we open. These can be paid up front for the year or billed monthly, both with a one-year commitment. And just like our founding members, regular members can pause their membership for up to 3 months if life calls for it.',
    ),
    category: 'membership',
    order: 2,
    location: parkCity,
  },

  /* --- food & drink ------------------------------------------------------- */
  {
    _id: 'faqItem.menu',
    _type: 'faqItem',
    question: 'What’s on the menu?',
    answer: pt(
      'Our cafe has something for everyone — anything from a quick snack to a full meal, for kids and grown-ups alike. Think prepared salads, sandwiches and wraps, warm pretzels, fresh baked goods, string cheese, kid charcuterie, great coffee, hot chocolate, and even beer and wine for the adults. Come hungry.',
    ),
    category: 'cafe',
    order: 1,
    location: parkCity,
  },
  {
    _id: 'faqItem.own-food',
    _type: 'faqItem',
    question: 'Can I bring my own food?',
    answer: pt(
      'Absolutely. You’re welcome to bring your own food and drinks — though we have a feeling you’ll want to try the cafe, too.',
    ),
    category: 'cafe',
    order: 2,
    location: parkCity,
  },

  /* --- parties & classes -------------------------------------------------- */
  {
    _id: 'faqItem.birthday-parties',
    _type: 'faqItem',
    question: 'Do you host birthday parties?',
    answer: pt([
      'We do! We’ll start booking parties closer to opening, with all the details to come. Keep an eye out — and ',
      // kind 'newsletter' opens the signup dialog, the same as every other
      // mailing-list link on the site. The href is the no-JavaScript fallback
      // to the footer's form.
      { text: 'sign up for our email club', href: '#newsletter', kind: 'newsletter' },
      ' so you’re the first to know.',
    ]),
    category: 'parties',
    order: 1,
    location: parkCity,
  },
  {
    _id: 'faqItem.classes',
    _type: 'faqItem',
    question: 'Do you offer classes and workshops?',
    answer: pt(
      'Yes — and we can’t wait. Our full schedule will be released closer to opening, but we’re planning a lineup of music, movement, art, STEM, crafting and more! There’ll be something for every kind of kid.',
    ),
    category: 'parties',
    order: 2,
    location: parkCity,
  },
  {
    _id: 'faqItem.private-events',
    _type: 'faqItem',
    question: 'Can I host a private event or field trip?',
    answer: pt([
      'We’d love to host your group! Just ',
      { text: 'reach out', href: `mailto:${parkCity.email}` },
      ' about private events, school field trips, and group visits.',
    ]),
    category: 'parties',
    order: 3,
    location: parkCity,
  },

  /* --- health & safety ---------------------------------------------------- */
  {
    _id: 'faqItem.grip-socks',
    _type: 'faqItem',
    question: 'Do you require grip socks?',
    answer: pt(
      'Yes — grip socks are required for everyone in the play areas, kids and grown-ups alike. Forget yours? We’ll have some available for purchase.',
    ),
    category: 'safety',
    order: 1,
    location: parkCity,
  },
  {
    _id: 'faqItem.safety-practices',
    _type: 'faqItem',
    question: 'What are your health and safety practices?',
    answer: pt(
      'The safety of every child is our top priority. We clean and sanitize throughout the day, do a deep clean each night, run daily safety inspections, and our team is trained in first aid, CPR, and emergency response.',
    ),
    category: 'safety',
    order: 2,
    location: parkCity,
  },
  {
    _id: 'faqItem.illness',
    _type: 'faqItem',
    question: 'What happens if my child or someone in our family is sick?',
    answer: pt(
      'To keep everyone healthy, we ask that children and adults who are feeling unwell visit us another day.',
    ),
    category: 'safety',
    order: 3,
    location: parkCity,
  },
];
