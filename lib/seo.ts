import type { Metadata } from 'next';
import type { Page, SiteSettings } from '@/types/content';
import { isProduction } from '@/lib/site';

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

  return {
    title: seo?.title ?? page.title,
    description: seo?.description ?? settings.defaultSeo?.description,
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}
