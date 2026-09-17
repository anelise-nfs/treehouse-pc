import type { Metadata } from 'next';
import type { Page, SiteSettings } from '@/types/content';

/**
 * Builds Next's Metadata from page + site content. Takes both as arguments
 * rather than fetching, so it stays out of the content access layer.
 */
export function pageMetadata(page: Page, settings: SiteSettings): Metadata {
  const seo = page.seo;
  const noIndex = seo?.noIndex ?? settings.defaultSeo?.noIndex ?? false;

  return {
    title: seo?.title ?? page.title,
    description: seo?.description ?? settings.defaultSeo?.description,
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}
