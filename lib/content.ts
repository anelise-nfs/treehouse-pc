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
  HeaderLogoSize,
  HeaderSurface,
  HeaderVariant,
  Link,
  Page,
  PricingTier,
  SiteSettings,
} from '@/types/content';

import { faqs } from '@/content/faqs';
import { pricingTiers } from '@/content/pricing';
import { siteSettings } from '@/content/site';
import { contactPage } from '@/content/pages/contact';
import { earlyBirdPage } from '@/content/pages/earlyBird';
import { homePage } from '@/content/pages/home';

/** Keyed by slug. The homepage's slug is the empty string. */
const pages: Page[] = [homePage, earlyBirdPage, contactPage];

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
    blocks: page.blocks.map((block) =>
      block._type === 'hoursAddress' && !block.location
        ? { ...block, location: siteSettings.location }
        : block,
    ),
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

export async function getFaqs(): Promise<FaqItem[]> {
  return [...faqs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
