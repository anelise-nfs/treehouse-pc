/**
 * The site's canonical origin, in one place.
 *
 * Metadata, the sitemap and robots.txt all read this, so they cannot disagree
 * about which host is canonical — which matters because www and the apex are
 * different origins to a crawler.
 *
 * NEXT_PUBLIC_ because `metadataBase` is evaluated where the page is rendered
 * and the value is public anyway: it is the address of the site.
 */
const FALLBACK_URL = 'https://www.treehouseparkcity.com';

/**
 * No trailing slash, ever. Every caller joins paths onto this, and a stray
 * slash in the environment variable would produce `//contact` in the sitemap
 * — a different URL to a crawler, and a duplicate of a real page.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_URL).replace(/\/+$/, '');

/**
 * Absolute URL for a site-relative path.
 *
 * The homepage is the bare origin rather than `origin + '/'`: both resolve to
 * the same page, but listing one form in the sitemap and linking the other
 * invites a crawler to treat them as two.
 */
export function absoluteUrl(path = '/'): string {
  const trimmed = path.replace(/^\/+/, '');
  return trimmed ? `${siteUrl}/${trimmed}` : siteUrl;
}

/**
 * True only on the real production deployment, on any host.
 *
 * THE SINGLE DEFINITION. robots.txt, the layout's noindex metadata and the GTM
 * gate all read this one value, so a preview deployment cannot end up indexed
 * but untracked, or tracked but unindexed.
 *
 * Two signals, either sufficient:
 *
 *   NEXT_PUBLIC_SITE_ENV  set by hand in the host's production environment.
 *                         Host-agnostic, which is what makes this work on
 *                         Netlify today and Vercel later without a code change.
 *   VERCEL_ENV            set by Vercel itself to 'production', 'preview' or
 *                         'development'. Kept so a Vercel production deploy is
 *                         correct even if nobody remembers to add the variable
 *                         above.
 *
 * Both are unset locally and on every preview, so anything that is not the
 * production deployment is treated as not-production. Erring that way is the
 * right direction: an unindexed preview costs nothing, an indexed one costs
 * duplicate content against the real site.
 *
 * Neither is a secret and neither is trusted for anything but this — they
 * decide what gets crawled and measured, not what gets served.
 */
export const isProduction =
  process.env.NEXT_PUBLIC_SITE_ENV === 'production' ||
  process.env.VERCEL_ENV === 'production';
