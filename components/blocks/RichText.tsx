import type { RichTextBlock } from '@/types/content';
import { PortableText } from '@/components/PortableText';
import { DecorationLayer } from '@/components/doodles/DecorationLayer';

/**
 * A passage of authored copy, optionally with a smaller secondary line beneath.
 *
 * `subcopy` is a separate field rather than a trailing paragraph inside
 * `content` because the two are styled differently — serif lead against muted
 * sans — and an author should not have to know that the last paragraph gets
 * picked up and treated differently from the rest.
 *
 * PortableText renders a flat run of sibling elements, so the space between
 * paragraphs is set here with space-y rather than by the renderer.
 */
export function RichText({
  heading,
  content,
  subcopy,
  width = 'measure',
  align = 'left',
  decorations,
  anchorId,
}: RichTextBlock) {
  const centered = align === 'center';

  return (
    <section id={anchorId} className="container-page relative my-[var(--spacing-section)]">
      <DecorationLayer decorations={decorations} />
      <div
        className={`${width === 'measure' ? 'measure' : ''} ${
          centered ? 'mx-auto text-center' : 'text-left'
        }`}
      >
        {heading ? (
          <h2 className="mb-[var(--spacing-block)] font-serif text-[length:var(--text-h2)] text-ink">
            {heading}
          </h2>
        ) : null}

        <div className="space-y-[var(--spacing-block)]">
          <PortableText
            blocks={content}
            className="font-serif text-[length:var(--text-lead)] text-ink"
          />
        </div>

        {subcopy ? (
          <div className="mt-[var(--spacing-gutter)] space-y-[var(--spacing-gutter)]">
            <PortableText
              blocks={subcopy}
              className="font-sans text-[length:var(--text-ui)] text-ink-soft"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
