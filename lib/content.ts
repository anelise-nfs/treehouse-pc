/**
 * The content access layer, and the ONLY file in the repo permitted to import
 * from `/content/`. See ARCHITECTURE.md → Prime directive.
 *
 * In Phase 2 the bodies below become GROQ queries against Sanity and `/content/`
 * is deleted. Every function is already `async` so that swap does not touch a
 * single call site.
 */
import type {
  FaqItem,
  FaqSection,
  HeaderLogoSize,
  HeaderSurface,
  HeaderVariant,
  Link,
  Page,
  PressItem,
  PricingTier,
  SiteSettings,
} from '@/types/content';

import { faqSections, faqs } from '@/content/faqs';
import { pressItems } from '@/content/press';
import { pricingTiers } from '@/content/pricing';
import { siteSettings } from '@/content/site';
import { contactPage } from '@/content/pages/contact';
import { earlyBirdPage } from '@/content/pages/earlyBird';
import { homePage } from '@/content/pages/home';
import { faqPage } from '@/content/pages/faq';
import { privacyPage } from '@/content/pages/privacy';
import { termsPage } from '@/content/pages/terms';
import { pressPage } from '@/content/pages/press';

/** Keyed by slug. The homepage's slug is the empty string. */
const pages: Page[] = [
  homePage,
  earlyBirdPage,
  contactPage,
  pressPage,
  faqPage,
  privacyPage,
  termsPage,
];

/**
 * Press coverage, newest first.
 *
 * Sorted on a padded key so the two date precisions compare correctly: a
 * 'YYYY-MM' item becomes 'YYYY-MM-00', which places it before anything dated
 * to a day within the same month. Plain string comparison then works, because
 * ISO dates sort lexicographically — no Date parsing, and so no timezone to
 * get wrong. Becomes `| order(date desc)` in Phase 2.
 */
function sortedPressItems(): PressItem[] {
  const key = (item: PressItem) => (item.date.length === 7 ? `${item.date}-00` : item.date);
  return [...pressItems].sort((a, b) => key(b).localeCompare(key(a)));
}

/**
 * The FAQ, grouped into its sections in the order content/faqs.ts declares.
 *
 * Questions sort by `order` within a section, ties falling back to source
 * order — the same rule getFaqs() applies to the flat list. A section with no
 * questions is dropped rather than rendered as an empty heading, so deleting
 * the last question in a category is a one-line edit and not a visual bug.
 *
 * Becomes a grouped GROQ query in Phase 2.
 */
function sortedFaqSections(): FaqSection[] {
  return faqSections
    .map(({ category, title, titleColor }) => ({
      _key: category,
      title,
      titleColor,
      items: faqs
        .filter((item) => item.category === category)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    }))
    .filter((section) => section.items.length > 0);
}

/** '' for the homepage, '/early-bird' for the rest. */
function routeOf(page: Page): string {
  return page.slug === '' ? '/' : `/${page.slug}`;
}

/**
 * Returns null rather than throwing, so a route can call `notFound()` and get a
 * real 404 instead of a 500.
 */
export async function getPage(slug: string): Promise<Page | null> {
  const page = pages.find((candidate) => candidate.slug === slug) ?? null;
  if (!page) return null;
  warnOnHeadingStructure(page);
  return resolveSiteReferences(page);
}

/**
 * Fills the site-level references a block declares but does not author.
 *
 * Hours and the address live once, on SiteSettings. Resolving them here keeps
 * components on props alone (ARCHITECTURE.md → Prime directive) while still
 * giving that data a single home, and mirrors what GROQ's `location->` will do
 * in Phase 2.
 */
function resolveSiteReferences(page: Page): Page {
  return {
    ...page,
    blocks: page.blocks.map((block) => {
      if (block._type === 'hoursAddress' && !block.location) {
        return { ...block, location: siteSettings.location };
      }
      // Press items are their own documents, not page content. The page
      // declares the block and this fills it, which is what the GROQ query
      // will do directly in Phase 2.
      if (block._type === 'pressList') {
        return { ...block, items: sortedPressItems() };
      }
      // Same arrangement as pressList: the questions are their own documents,
      // the page declares the block, and this fills it.
      if (block._type === 'faqAccordion') {
        return { ...block, sections: sortedFaqSections() };
      }
      return block;
    }),
  };
}

/**
 * Exactly one h1 must render per page. Only two blocks produce one: a hero (its
 * `overlayHeadline`) and a pageHeader (its `title`). Section bands are always
 * h2 regardless of how large they look.
 *
 * Warns rather than throws — a content mistake should not take down a build —
 * and is stripped from production.
 */
function warnOnHeadingStructure(page: Page): void {
  if (process.env.NODE_ENV === 'production') return;

  const sources = page.blocks.filter(
    (block) => block._type === 'hero' || block._type === 'pageHeader',
  );

  if (sources.length === 1) return;

  console.warn(
    `[content] Page "${page._id}" has ${sources.length} h1 sources; expected exactly 1. ` +
      'Every page needs exactly one hero or pageHeader block.',
  );
}

/** Drives `generateStaticParams`. The homepage is excluded — it has its own route. */
export async function getAllPageSlugs(): Promise<string[]> {
  return pages.map((page) => page.slug);
}

/**
 * Header wordmark size per route path, for the header rendered in the root
 * layout (which has no access to the active page).
 *
 * A page that opens with a hero gets the large lockup; a pageHeader gets the
 * default. Derived from block structure rather than authored so adding a page
 * cannot forget to set it.
 */
export async function getHeaderLogoSizes(): Promise<Record<string, HeaderLogoSize>> {
  return Object.fromEntries(
    pages.map((page) => [
      routeOf(page),
      page.blocks.some((block) => block._type === 'hero') ? 'large' : 'default',
    ]),
  );
}

/**
 * Which header each route wears. Read straight off the page — the one header
 * setting that is authored rather than inferred, because it is an editorial
 * decision and not a consequence of the blocks underneath it.
 */
export async function getHeaderVariants(): Promise<Record<string, HeaderVariant>> {
  return Object.fromEntries(pages.map((page) => [routeOf(page), page.headerVariant]));
}

/**
 * What the overlay header is sitting on, which decides whether it draws itself
 * in ink or in white over a scrim.
 *
 * Still derived from the opening block, unlike the variant above, because this
 * one genuinely is a consequence of the layout: a hero opens with a linen text
 * column under the header, and anything else opens with a photograph. Authoring
 * it would let the two fall out of step.
 *
 * Only read on 'overlay' routes. Sub-pages wear the opaque top bar, so the
 * value computed for them here is never used.
 */
export async function getHeaderSurfaces(): Promise<Record<string, HeaderSurface>> {
  return Object.fromEntries(
    pages.map((page) => [
      routeOf(page),
      page.blocks.some((block) => block._type === 'hero') ? 'light' : 'photo',
    ]),
  );
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return siteSettings;
}

/**
 * Every page that can be put in the navigation, newest definition of "main
 * page" being simply: a page that exists.
 *
 * This is the list an editor picks from. In Phase 2 it is what Sanity's
 * reference filter resolves against, so the choices stay in step with the
 * pages without anyone maintaining a second list. Building a nav UI off this
 * rather than off hand-typed hrefs is what makes "any page can be in the nav"
 * true rather than aspirational.
 */
export async function getNavigablePages(): Promise<{ slug: string; path: string; title: string }[]> {
  return pages.map((page) => ({ slug: page.slug, path: routeOf(page), title: page.title }));
}

/**
 * The sub-page top bar's links, resolved from page references to hrefs.
 *
 * Resolution happens here, not in the component, for the same reason the rest
 * of this file exists: components take presentation-ready props and know
 * nothing about how content is stored. The nav bar receives plain Links and
 * will not change when these become real Sanity references.
 *
 * An entry pointing at a slug with no page is dropped rather than rendered
 * dead, and warns in development. Sanity's reference field makes that
 * unreachable by construction; until then this is the guard.
 */
export async function getTopNav(): Promise<Link[]> {
  const items = siteSettings.topNav ?? [];

  return items.flatMap((item) => {
    const page = pages.find((candidate) => candidate.slug === item.page);

    if (!page) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `[content] topNav entry points at slug "${item.page}", which has no page. Dropped.`,
        );
      }
      return [];
    }

    return [{ label: item.label ?? page.title, kind: 'internal' as const, href: routeOf(page) }];
  });
}

/** Founding tiers first, then the standard rates that apply after opening. */
export async function getPricing(): Promise<PricingTier[]> {
  return pricingTiers;
}

/** The FAQ grouped for display. The /faq page gets these through its block. */
export async function getFaqSections(): Promise<FaqSection[]> {
  return sortedFaqSections();
}

export async function getFaqs(): Promise<FaqItem[]> {
  return [...faqs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/**
 * Press coverage, newest first. The /press page gets these through its
 * pressList block; this is for anything else that wants them — a homepage
 * teaser, a feed — without reaching into /content/.
 */
export async function getPressItems(): Promise<PressItem[]> {
  return sortedPressItems();
}
