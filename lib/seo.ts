import type { Metadata } from 'next';
import type { Page, SiteSettings } from '@/types/content';
import { isProduction, shareImage, siteUrl } from '@/lib/site';

/**
 * Builds Next's Metadata from page + site content. Takes both as arguments
 * rather than fetching, so it stays out of the content access layer.
 */
export function pageMetadata(page: Page, settings: SiteSettings): Metadata {
  const seo = page.seo;

  /* The same two independent reasons the root layout applies, and for the same
     reason — environment first, then content.

     The environment half has to be repeated here rather than inherited: a
     page's metadata overrides the layout's field by field, so returning
     `robots: undefined` from this function discards whatever the layout set.
     While every page carried `noIndex: true` that never showed, because this
     function always returned a robots object; clearing the pre-launch flags
     exposed it, and every page outside production lost its noindex tag.

     robots.txt is the other layer and still disallows everything off
     production, but it only asks a crawler not to fetch. This is the tag that
     covers a preview URL reached from an inbound link. */
  const noIndex = !isProduction || (seo?.noIndex ?? settings.defaultSeo?.noIndex ?? false);

  const title = seo?.title ?? page.title;
  const description = seo?.description ?? settings.defaultSeo?.description;
  const path = page.slug === '' ? '/' : `/${page.slug}`;

  return {
    title,
    description,
    robots: noIndex ? { index: false, follow: false } : undefined,
    /* Repeated here rather than inherited from the root layout: Next replaces
       a parent's `openGraph` wholesale when a page declares one and does not
       merge field by field, so a page that set only title and description
       would share the site's name instead of its own. The image is the same
       file for every page — one card, not nine. */
    openGraph: {
      type: 'website',
      siteName: settings.siteName,
      title,
      description,
      url: `${siteUrl}${path}`,
      images: [shareImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [shareImage.url],
    },
  };
}
