import type { MetadataRoute } from 'next';
import { getIndexablePages } from '@/lib/content';
import { absoluteUrl } from '@/lib/site';

/**
 * The sitemap, derived rather than listed.
 *
 * The URL set comes from getIndexablePages(), which reads the same `pages`
 * array the routes themselves render from. A page added there appears here
 * with no edit to this file — which is the point: the previous version kept a
 * hand-written array and had fallen three pages behind without anything
 * failing, because nothing checks a sitemap against reality.
 *
 * What stays here is the weighting. Which pages exist and whether they may be
 * indexed is a content question and lives in the content layer; how strongly
 * to recommend each one to a crawler is an SEO judgement and lives with the
 * sitemap. Splitting them that way is what lets the list derive itself while
 * the priorities stay deliberate.
 */

/** Weighting by route, with a default for anything not named. */
interface Weight {
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
}

/**
 * Priority is relative, not absolute: it tells a crawler how pages rank
 * against each other on this site, and nothing about how they rank against
 * anyone else's. The spread matters, the numbers do not.
 *
 * The ordering reflects what the site is for while the sale is on — the
 * homepage, then the page that sells memberships, then the pages that answer
 * questions, then the boilerplate nobody searches for but every site needs.
 */
const WEIGHTS: Record<string, Weight> = {
  '/': { priority: 1, changeFrequency: 'weekly' },
  // /early-bird sat second at 0.9 and is gone — the founding sale closed and
  // the page went with it. Nothing replaces it at that weight: the homepage
  // carries the membership copy now.
  '/faq': { priority: 0.7, changeFrequency: 'monthly' },
  // Also sells something, but a smaller something than a founding membership
  // and not the reason anyone arrives.
  '/gift-cards': { priority: 0.6, changeFrequency: 'monthly' },
  '/press': { priority: 0.6, changeFrequency: 'monthly' },
  '/contact': { priority: 0.5, changeFrequency: 'monthly' },
  // Legal boilerplate: required, rarely read, almost never searched for, and
  // changed only when counsel says so.
  '/privacy': { priority: 0.3, changeFrequency: 'yearly' },
  '/terms': { priority: 0.3, changeFrequency: 'yearly' },
};

/**
 * Where an unlisted route lands. A new page is in the sitemap immediately at a
 * middling weight, and tuning it is one line above rather than a prerequisite
 * for being listed at all.
 */
const DEFAULT_WEIGHT: Weight = { priority: 0.5, changeFrequency: 'monthly' };

/**
 * Last-modified dates, for the pages whose content has settled.
 *
 * A fixed date per route, not `new Date()` and not the build date. `new Date()`
 * would tell a crawler every page changed on every request, and the build date
 * would say the same on every deploy including ones that only touched CSS.
 * Either teaches Google to ignore the field.
 *
 * Omission is deliberate and safe: `lastModified` is optional in the protocol,
 * and no date is better than a wrong one. A page added later simply has no
 * entry here until someone sets one, which never blocks it from being listed.
 */
const LAST_MODIFIED: Record<string, string> = {
  '/': '2026-11-19',
  '/faq': '2026-11-19',
  '/press': '2026-11-19',
  '/privacy': '2026-11-19',
  '/terms': '2026-11-19',
  '/contact': '2026-11-12',
  '/gift-cards': '2026-11-24',
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getIndexablePages();

  return pages.map((page) => {
    const weight = WEIGHTS[page.path] ?? DEFAULT_WEIGHT;
    const lastModified = LAST_MODIFIED[page.path];

    return {
      url: absoluteUrl(page.path),
      ...(lastModified ? { lastModified: new Date(lastModified) } : {}),
      changeFrequency: weight.changeFrequency,
      priority: weight.priority,
    };
  });

  // PHASE 2 (Sanity): dynamic routes append here, fetched through
  // /lib/content.ts rather than from Sanity directly — see ARCHITECTURE.md →
  // Prime directive. A post carries `_updatedAt`, a real per-document
  // timestamp, which is what the fixed dates above are standing in for.
}
