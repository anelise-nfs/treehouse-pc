import type { MetadataRoute } from 'next';
import { isProduction, siteUrl } from '@/lib/site';

/**
 * robots.txt.
 *
 * Two completely different files depending on where this is deployed, which
 * is the point: a preview deployment serves the same pages as production, so
 * without this a crawler can find a branch URL and index it as a duplicate of
 * the real site. Google then has to choose between them, and it does not
 * always choose the one you wanted.
 *
 * Preview and local get a blanket disallow. Only the real production
 * deployment is crawlable.
 *
 * This is one of two layers. The other is `robots: { index: false }` in the
 * root layout's metadata, which emits a meta tag. They cover different gaps:
 * robots.txt asks a crawler not to fetch, the meta tag tells it not to index
 * something it fetched anyway — a page reached via an inbound link, say.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          // No Studio route exists yet. Listed ahead of Phase 2 because the
          // cost of naming a path that never appears is nothing, and the cost
          // of forgetting it the week Studio ships is an indexed CMS login.
          '/studio',
          '/studio/',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    // www is canonical. Non-standard and ignored by Google, but honoured by
    // some crawlers, and it costs one line to state the preference.
    host: siteUrl,
  };
}
