import type { RichTextBlock } from '@/types/content';
import { CtaLink } from '@/components/CtaLink';
import { SCRIPT_HEADING_COLOR } from '@/components/blocks/ImageTextSplit';
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
  headingColor,
  cta,
  decorations,
  anchorId,
}: RichTextBlock) {
  const centered = align === 'center';

  return (
    <section id={anchorId} data-reveal
      className="container-page relative my-[var(--spacing-section)]">
      <DecorationLayer decorations={decorations} />
      <div
        className={`${width === 'measure' ? 'measure' : ''} ${
          centered ? 'mx-auto text-center' : 'text-left'
        }`}
      >
        {/* Script, matching the subsection headings on the image/text splits
            and the perk lists — ARCHITECTURE.md -> Script subsection headings.
            --text-script-sm is clamped so it cannot fall below the face's 28px
            floor at any width.

            Colour comes from the same map the image/text splits use, so the
            two cannot drift. Unset falls back to ink (16.78:1 on linen). Of
            the authored options, pine and tangerine clear AA outright; ocean
            and tomato pass as large text, which a script heading always is. */}
        {heading ? (
          <h2
            className={`mb-[var(--spacing-block)] font-script text-[length:var(--text-script-sm)] leading-[var(--leading-heading)] ${
              headingColor ? SCRIPT_HEADING_COLOR[headingColor] : 'text-ink'
            }`}
          >
            {heading}
          </h2>
        ) : null}

        {/* [&_a] rather than a class on the link: PortableText emits a bare
            <a>, and the surrounding block decides how a link in its prose
            looks. Underlined, because colour alone cannot mark a link — and
            with Tailwind's preflight a bare <a> inherits both colour and
            decoration, so without this a link here is invisible as one. Same
            treatment NewsletterBlock gives its prose. */}
        <div className="space-y-[var(--spacing-block)] [&_a]:underline [&_a]:underline-offset-2">
          <PortableText
            blocks={content}
            className="font-serif text-[length:var(--text-lead)] text-ink"
          />
        </div>

        {subcopy ? (
          <div className="mt-[var(--spacing-gutter)] space-y-[var(--spacing-gutter)] [&_a]:underline [&_a]:underline-offset-2">
            <PortableText
              blocks={subcopy}
              className="font-sans text-[length:var(--text-ui)] text-ink-soft"
            />
          </div>
        ) : null}

        {/* Same spacing ImageTextSplit gives its button, so a copy block that
            ends in an action reads the same wherever it appears. Absent on
            every block that does not set one. */}
        {cta ? (
          <p className="mt-[var(--spacing-block)]">
            <CtaLink link={cta} />
          </p>
        ) : null}
      </div>
    </section>
  );
}
