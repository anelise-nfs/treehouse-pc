import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { getPage, getSiteSettings } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getPage(''), getSiteSettings()]);
  if (!page) return {};
  return pageMetadata(page, settings);
}

export default async function HomePage() {
  const page = await getPage('');
  if (!page) notFound();

  // No CheckoutScript. This route carried it while the membership buttons
  // opened ROLLER's overlay; with the founding sale closed there is not one
  // checkout trigger left on the homepage, and loading a third-party payment
  // widget that nothing can open is a request made of every visitor for
  // nothing. /gift-cards is the only route that still needs it.
  return (
    <main id="main">
      <BlockRenderer blocks={page.blocks} />
    </main>
  );
}
