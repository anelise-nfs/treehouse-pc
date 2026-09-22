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
  Page,
  PartyPackage,
  PricingTier,
  SiteSettings,
} from '@/types/content';

import { faqs } from '@/content/faqs';
import { partyPackages } from '@/content/parties';
import { pricingTiers } from '@/content/pricing';
import { siteSettings } from '@/content/site';
import { earlyBirdPage } from '@/content/pages/earlyBird';
import { homePage } from '@/content/pages/home';

/** Keyed by slug. The homepage's slug is the empty string. */
const pages: Page[] = [homePage, earlyBirdPage];

/**
 * Returns null rather than throwing, so a route can call `notFound()` and get a
 * real 404 instead of a 500.
 */
export async function getPage(slug: string): Promise<Page | null> {
  const page = pages.find((candidate) => candidate.slug === slug) ?? null;
  if (page) warnOnHeadingStructure(page);
  return page;
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
      page.slug === '' ? '/' : `/${page.slug}`,
      page.blocks.some((block) => block._type === 'hero') ? 'large' : 'default',
    ]),
  );
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return siteSettings;
}

/** Founding tiers first, then the standard rates that apply after opening. */
export async function getPricing(): Promise<PricingTier[]> {
  return pricingTiers;
}

export async function getPartyPackages(): Promise<PartyPackage[]> {
  return partyPackages;
}

export async function getFaqs(): Promise<FaqItem[]> {
  return [...faqs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
