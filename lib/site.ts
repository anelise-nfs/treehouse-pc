/**
 * The site's canonical origin, in one place.
 *
 * Metadata, the sitemap and robots.txt all read this, so they cannot disagree
 * about which host is canonical — which matters because www and the apex are
 * different origins to a crawler.
 *
 * NEXT_PUBLIC_ because `metadataBase` is evaluated where the page is rendered
 * and the value is public anyway: it is the address of the site.
 *
 * THE APEX IS CANONICAL, and the fallback has to say so. Netlify sets
 * NEXT_PUBLIC_SITE_URL to the apex and 301s www to it, so in production this
 * default is never read — which is exactly why it was wrong for a while
 * without anything breaking. A build that loses the variable (a new deploy
 * context, a fresh site, someone clearing it) would otherwise go back to
 * advertising www as canonical in og:url, the sitemap and robots.txt while
 * the server redirected the other way. www and the apex are different origins
 * to a crawler, and that disagreement is the whole thing this file exists to
 * prevent. Change this if the canonical host ever changes, in the same commit
 * as the host config.
 */
const FALLBACK_URL = 'https://treehouseparkcity.com';

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
 * The default social-share card.
 *
 * 1200x630 is the size every platform crops from, and the composition assumes
 * it: the wordmark sits well inside a linen panel on the left with the photo
 * on the right, so a centre crop on a narrower card still holds both.
 *
 * It is a real file rather than a generated one. next/og would render it at
 * request time, which this site has no server for, and it is the subject of an
 * open advisory in the Next version pinned here — a flat asset has neither
 * problem. Regenerate it by hand if the wordmark or the photograph changes.
 *
 * THE FILENAME IS VERSIONED, AND THE VERSION MUST BE BUMPED WHENEVER THE
 * IMAGE CHANGES. Facebook and LinkedIn cache the image against its URL, not
 * just the tags around it: re-scraping a page refreshes og:title and
 * og:description and still serves the old picture, because the URL it hangs
 * on did not move. That is not a cache that reliably clears on request — a
 * new path is the only thing it cannot ignore.
 *
 * So: edit the artwork, save it as -v3, change the one line below, redeploy.
 * Leaving the old file in place costs 180KB and means any preview already
 * cached against it keeps working rather than breaking to a 404.
 *
 * WITHOUT THIS, link previews scrape the page and pick the header wordmark: a
 * 2176x430 transparent PNG that messaging apps composite on a colour of their
 * own choosing and crop to the card, which put the logo hard against all four
 * edges.
 */
export const shareImage = {
  url: '/images/og-default-v2.jpg',
  width: 1200,
  height: 630,
  alt: 'The Treehouse wordmark beside a photograph of the indoor play structure',
};

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
