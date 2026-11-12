import type { NewsletterSignupBlock } from '@/types/content';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { PortableText } from '@/components/PortableText';
import { DecorationLayer } from '@/components/doodles/DecorationLayer';

/**
 * A mailing-list signup in a page's flow.
 *
 * Wraps the same NewsletterSignup the footer and the dialog use, so there is
 * one signup implementation and one endpoint wherever it appears. This block
 * contributes the heading and intro above it and nothing else.
 *
 * `withAnchor={false}`: the footer's copy owns `#newsletter`, and the site's
 * "sign up for updates" buttons target it. Two elements with that id would be
 * a bug, not a fallback.
 *
 * The heading matches the script treatment the other block headings use rather
 * than the signup's own, which is sized for a footer column.
 */
export function NewsletterBlock({ heading, intro, decorations, anchorId }: NewsletterSignupBlock) {
  return (
    <section
      id={anchorId}
      data-reveal
      className="container-page relative my-[var(--spacing-section)]"
    >
      <DecorationLayer decorations={decorations} />

      <div className="measure mx-auto">
        {heading ? (
          <h2 className="font-script text-[length:var(--text-script-sm)] leading-[var(--leading-heading)] text-ink">
            {heading}
          </h2>
        ) : null}

        {/* [&_a] rather than a class on the link: PortableText emits a bare
            <a>, and the surrounding block decides how a link in its prose
            looks. Underlined, because colour alone cannot mark a link. */}
        <div className="mt-[var(--spacing-gutter)] space-y-2 [&_a]:underline [&_a]:underline-offset-2">
          <PortableText
            blocks={intro}
            className="font-serif text-[length:var(--text-body)] text-ink"
          />
        </div>

        <NewsletterSignup
          tone="light"
          withAnchor={false}
          className="mt-[var(--spacing-block)]"
        />
      </div>
    </section>
  );
}
