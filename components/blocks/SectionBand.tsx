import type { BandColor, SectionBandBlock } from '@/types/content';
import { PortableText } from '@/components/PortableText';
import { DecorationLayer } from '@/components/doodles/DecorationLayer';

/**
 * CONTRAST: the band label is white on every fill, per the client's design,
 * and it passes — but only because it is always large text. The label is set
 * in --text-script-sm, which floors at 28px, so WCAG's 3:1 large-text bar
 * applies rather than 4.5:1.
 *
 * Measured against the current palette: pine 6.66, tangerine 4.67, tomato
 * 3.85, ocean 3.56, lime 3.14, mint 3.13, sky 3.12, sunshine 3.12, flamingo
 * 3.11. Pine and tangerine clear 4.5:1 outright; the rest sit just above 3:1.
 *
 * So the size is the compliance here. Anything that lets this label render
 * under 28px breaks seven of the ten colors at once.
 *
 * SEAFOAM IS THE EXCEPTION: white on it is 1.49:1, which fails even as large
 * text. No band uses it today. If one ever does, it needs ink, not white —
 * --color-on-seafoam is already ink for exactly this reason.
 *
 * These numbers superseded a much worse set. The earlier note here recorded
 * mint at 2.15, flamingo 2.34, lime 2.00 and so on, and called them outright
 * failures; those were measured before the palette was darkened and are no
 * longer what the site renders.
 */
const BAND_BG: Record<BandColor, string> = {
  pine: 'bg-pine',
  mint: 'bg-mint',
  tangerine: 'bg-tangerine',
  flamingo: 'bg-flamingo',
  seafoam: 'bg-seafoam',
  sunshine: 'bg-sunshine',
  lime: 'bg-lime',
  tomato: 'bg-tomato',
  sky: 'bg-sky',
  ocean: 'bg-ocean',
};

/**
 * Full-bleed color band marking a section of the page.
 *
 * Full-bleed comes for free: `main` sets no max width, so the section spans the
 * viewport and the inner container-page pulls the text back to the content
 * column and carries the gutter.
 *
 * primary and secondary are separated mostly by band height, not type size.
 * The script face has a hard 28px floor, and both --text-band and
 * --text-script-sm bottom out there, so the two levels are the same size on
 * mobile and about a pixel apart at full desktop width. Padding is what makes
 * a secondary band read as subordinate.
 */
export function SectionBand({
  heading,
  mobileHeading,
  eyebrow,
  body,
  color,
  level,
  decorations,
  anchorId,
}: SectionBandBlock) {
  const isPrimary = level === 'primary';

  return (
    <section
      id={anchorId}
      className={`relative my-[var(--spacing-section)] ${
        isPrimary ? 'py-[var(--spacing-block)]' : 'py-[var(--spacing-gutter)]'
      }`}
    >
      {/* The colour is its own layer rather than the section's background, so it
          can wipe in on scroll while the heading above it stays still. */}
      <div aria-hidden="true" data-wipe className={`absolute inset-0 ${BAND_BG[color]}`} />
      <DecorationLayer decorations={decorations} />
      <div className="relative z-10 container-page text-center">
        {eyebrow ? (
          <p className="font-sans text-[length:var(--text-ui)] font-semibold text-white">
            {eyebrow}
          </p>
        ) : null}

        <h2
          className={`font-script leading-[var(--leading-heading)] text-white ${
            isPrimary ? 'text-[length:var(--text-band)]' : 'text-[length:var(--text-script-sm)]'
          }`}
        >
          {/* A shorter string on mobile, never a smaller one — the script face
              cannot shrink and still clear its floor. */}
          {mobileHeading ? (
            <>
              <span className="md:hidden">{mobileHeading}</span>
              <span className="hidden md:inline">{heading}</span>
            </>
          ) : (
            heading
          )}
        </h2>

        <PortableText
          blocks={body}
          className="measure mx-auto mt-[var(--spacing-block)] font-serif text-[length:var(--text-body)] text-white"
        />
      </div>
    </section>
  );
}
