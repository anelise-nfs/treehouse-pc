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

  return (
    <main id="main">
      <BlockRenderer blocks={page.blocks} />
    </main>
  );
}
