import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { CheckoutScript } from '@/components/CheckoutScript';
import { getCheckoutConfig, getPage, getSiteSettings } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

const SLUG = 'early-bird';

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getPage(SLUG), getSiteSettings()]);
  if (!page) return {};
  return pageMetadata(page, settings);
}

export default async function EarlyBirdPage() {
  const [page, checkout] = await Promise.all([getPage(SLUG), getCheckoutConfig()]);
  if (!page) notFound();

  return (
    <>
      <main id="main">
        <BlockRenderer blocks={page.blocks} />
      </main>
      {/* Outside <main>: it renders nothing and is not page content. This
          route sells memberships, so it is one of the three that loads the
          widget — see components/CheckoutScript.tsx. */}
      <CheckoutScript {...checkout} />
    </>
  );
}
