import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { getPage, getSiteSettings } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { faqPageJsonLd } from '@/lib/structuredData';

const SLUG = 'faq';

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getPage(SLUG), getSiteSettings()]);
  if (!page) return {};
  return pageMetadata(page, settings);
}

export default async function FaqPage() {
  const page = await getPage(SLUG);
  if (!page) notFound();

  /* Built from the same resolved block the accordion renders, not from a
     second read of the content. Two sources for the questions is how the
     markup and the page drift apart, and a mismatch between them is the one
     thing structured data is actually penalised for. */
  const accordion = page.blocks.find((block) => block._type === 'faqAccordion');
  const jsonLd = accordion ? faqPageJsonLd(accordion.sections) : null;

  return (
    <main id="main">
      {jsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      ) : null}
      <BlockRenderer blocks={page.blocks} />
    </main>
  );
}
