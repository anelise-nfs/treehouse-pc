import type { LegalDocumentBlock } from '@/types/content';
import { PortableText } from '@/components/PortableText';
import { DecorationLayer } from '@/components/doodles/DecorationLayer';

/**
 * A privacy policy or terms of use.
 *
 * TYPOGRAPHY IS DELIBERATELY QUIETER THAN THE REST OF THE SITE. Everything
 * else here is a marketing page that wants to be looked at; this is a document
 * that wants to be read, and read by someone hunting one clause out of forty.
 * So: no script face, no brand colour on the headings, tighter leading, and a
 * narrower column than `measure`.
 *
 * BODY STAYS AT 16px. The brief asked for smaller type and this is as small as
 * it goes — ARCHITECTURE.md fixes a hard floor at 16px for body copy on every
 * viewport, and legal text aimed at parents on phones is the last place to
 * make an exception. It does read a little smaller than the rest of the site,
 * because --text-body is fluid and tops out at 17px on a wide screen where
 * this is pinned to 16. The condensed feel comes from the measure, the leading
 * and the heading scale instead, none of which have a floor to respect.
 *
 * 54rem — about 864px, roughly 95 characters a line, and about three quarters
 * of the content column on a wide screen. The column itself caps at 1136px, so
 * there is room to about 62rem before the text reaches the page gutters.
 *
 * Wider than the 45-75 characters usually quoted for body text, on purpose.
 * That range is calibrated for prose read start to finish; this is a reference
 * document someone scans for one clause, mostly at a desk. Set to 66 characters
 * it measured 570px inside a 1136px column and read as a broken strip rather
 * than a considered measure.
 *
 * In rem rather than ch, unlike --spacing-measure. `ch` is the width of the
 * zero glyph, not of an average character, and Libre Baskerville's zero is
 * wide enough that the two numbers diverge badly — 62ch landed near 710px
 * here, not the ~620 the unit suggests. A rem value says what it will do.
 */
export function LegalDocument({
  eyebrow,
  effectiveDate,
  body,
  decorations,
  anchorId,
}: LegalDocumentBlock) {
  return (
    <section
      id={anchorId}
      data-reveal
      className="container-page relative mt-[var(--spacing-block)] mb-[calc(var(--spacing-section)*1.5)]"
    >
      <DecorationLayer decorations={decorations} />

      {/* Font and width set together on the same element. The width is in rem
          so it no longer depends on the font, but the two still belong
          together: the leading and colour below are inherited by every block
          the renderer emits, and splitting them sent the cap and the type
          they govern to different places. */}
      <div className="mx-auto max-w-[54rem] font-serif text-[1rem] leading-[1.65] text-ink">
        {eyebrow ? (
          <p className="font-sans text-[length:var(--text-caption)] text-ink-soft">{eyebrow}</p>
        ) : null}

        {effectiveDate ? (
          <p className="mt-1 font-sans text-[length:var(--text-caption)] text-ink-soft">
            {effectiveDate}
          </p>
        ) : null}

        {/* The whole document, styled by element rather than by position.
            Every selector below is scoped to this wrapper, so none of it can
            reach another block.

            Headings are sans at --text-lead, medium weight, with generous
            space above and little below — the gap belongs between a clause
            and the next heading, not between a heading and its own first
            line. They are h2: the page's h1 is the pageHeader's title, and
            the document's own numbering ('1.', '2.') carries the hierarchy
            that the markup would otherwise have to invent.

            scroll-mt keeps a heading clear of the sticky top bar if one is
            ever linked to directly.

            The blockquote is the attorney's bolded callout, set apart by a
            tinted ground alone. It carried a tangerine rule down its left
            edge as well, which was one marker too many for a panel that is
            already a different colour from the page.

            Padding is even now that the rule is gone: it was heavier on the
            left to clear that border, and without it the text sat off-centre
            in its own box. The card radius is the one every other panel on
            the site uses.

            Lists get a real marker and a hanging indent, so a clause that
            wraps stays aligned under its own text rather than under the
            bullet.

            h3 is the second level, used where a document has subsections
            under a numbered section — Schedule A's rule groups. One step down
            from h2 in size and sharing its face and weight, because the
            hierarchy here is shallow and a third distinct treatment would
            read as a third level that does not exist. Documents without
            subsections emit no h3 and are unaffected.

            Tables are the rate grids. Flush left with the text column and
            separated by right padding rather than boxed: a bordered grid in
            the middle of a page of prose reads as a different document. The
            column heads are sans at caption size, the one place in this block
            where the quieter face marks a label rather than a heading, and
            the row labels are reset to normal weight because `th` arrives
            bold and Libre Baskerville's bold is heavy enough to fight the
            figures beside it.

            Run-in bold leads ('3.1 Required Initial Annual Term.') need no
            rule of their own: Libre Baskerville 700 is loaded (app/layout.tsx)
            so `strong` in this serif column is real bold, not synthesised. */}
        <div
          className={[
            'mt-[var(--spacing-block)]',
            '[&_p]:mt-[1em]',
            '[&_h2]:mt-[2em] [&_h2]:mb-[0.4em] [&_h2]:scroll-mt-[var(--spacing-header-compact)]',
            '[&_h2]:font-sans [&_h2]:text-[length:var(--text-lead)] [&_h2]:font-medium',
            '[&_h2]:leading-[var(--leading-heading)] [&_h2]:text-ink',
            '[&_h3]:mt-[1.6em] [&_h3]:mb-[0.3em] [&_h3]:scroll-mt-[var(--spacing-header-compact)]',
            '[&_h3]:font-sans [&_h3]:text-[length:var(--text-body)] [&_h3]:font-medium',
            '[&_h3]:leading-[var(--leading-heading)] [&_h3]:text-ink',
            '[&_table]:mt-[1.5em] [&_table]:w-full [&_table]:border-collapse [&_table]:text-left',
            '[&_th]:border-b [&_th]:border-ink/15 [&_th]:py-2 [&_th]:align-top',
            '[&_td]:border-b [&_td]:border-ink/15 [&_td]:py-2 [&_td]:align-top',
            '[&_th]:pr-[var(--spacing-gutter)] [&_td]:pr-[var(--spacing-gutter)]',
            '[&_tr>*:last-child]:pr-0',
            '[&_thead_th]:border-ink/30 [&_thead_th]:font-sans [&_thead_th]:font-medium',
            '[&_thead_th]:text-[length:var(--text-caption)]',
            '[&_tbody_th]:font-normal',
            '[&_blockquote]:mt-[1.5em] [&_blockquote]:rounded-[var(--radius-card)]',
            '[&_blockquote]:bg-tangerine/5 [&_blockquote]:px-4 [&_blockquote]:py-3',
            '[&_blockquote]:text-[length:var(--text-caption)] [&_blockquote]:leading-[1.6]',
            '[&_a]:underline [&_a]:underline-offset-2',
          ].join(' ')}
        >
          <PortableText
            blocks={body}
            listClassName="mt-[1em] list-disc space-y-[0.6em] pl-5 marker:text-ink-soft"
          />
        </div>
      </div>
    </section>
  );
}
