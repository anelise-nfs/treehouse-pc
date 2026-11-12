import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';

/**
 * One entry per public, indexable route.
 *
 * Kept as a plain array so adding or reordering a page is a one-line edit,
 * and so the whole set is visible at a glance rather than spread across the
 * route files.
 *
 * NOT LISTED, deliberately:
 *   /doodles   internal design reference. Unlinked, and the page already
 *              sends robots: noindex. A sitemap entry would invite the crawl
 *              its own metadata then refuses.
 *   /_not-found  Next's built-in 404. Never belongs in a sitemap.
 *
 * There are no API routes, route groups, Studio, preview or auth-gated routes
 * in this app today. When any appear, they stay out of this array — a sitemap
 * is a list of pages worth indexing, not an inventory of what exists.
 */
interface Route {
  /** Site-relative. '/' is the homepage. */
  path: string;
  /**
   * A fixed date, not `new Date()` and not the build date.
   *
   * `new Date()` would tell a crawler every page changed on every request,
   * and the build date would say the same thing on every deploy — including
   * deploys that only touched CSS. Either teaches Google to ignore the field.
   * Update the date on a row when that page's content actually changes.
   */
  lastModified: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
}

const ROUTES: Route[] = [
  {
    path: '/',
    lastModified: '2026-11-12',
    changeFrequency: 'weekly',
    priority: 1,
  },
  {
    // Founding memberships. The money page until the sale closes.
    path: '/early-bird',
    lastModified: '2026-11-12',
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    path: '/contact',
    lastModified: '2026-11-12',
    changeFrequency: 'monthly',
    priority: 0.5,
  },
];

/**
 * Async even though nothing is awaited yet.
 *
 * Phase 2 moves content into Sanity, and the fetch below becomes real. Having
 * the signature already be async means adding it is an edit inside this
 * function rather than a change to its shape.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: new Date(route.lastModified),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // TODO — PHASE 2 (Sanity). Dynamic routes get appended here, e.g.:
  //
  //   const posts = await getAllPosts();            // from /lib/content.ts
  //   const dynamicEntries = posts.map((post) => ({
  //     url: absoluteUrl(`/blog/${post.slug}`),
  //     lastModified: new Date(post._updatedAt),     // Sanity's own timestamp
  //     changeFrequency: 'monthly' as const,
  //     priority: 0.5,
  //   }));
  //   return [...staticEntries, ...dynamicEntries];
  //
  // Fetch through /lib/content.ts, never from Sanity directly — see
  // ARCHITECTURE.md → Prime directive. Note that `_updatedAt` gives a real
  // per-document date, which is what the fixed dates above are standing in
  // for until then.

  return staticEntries;
}
