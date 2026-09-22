import type { BandColor, SectionBandBlock } from '@/types/content';
import { PortableText } from '@/components/PortableText';

/**
 * CONTRAST: provisional across this whole map. The band label is white on every
 * color, per the client's design, and white clears AA on pine alone (6.66:1).
 * Ocean 3.56:1, tomato 3.85:1 and tangerine 3.20:1 clear the 3:1 large-text bar
 * and nothing else; mint 2.15:1, flamingo 2.34:1, lime 2.00:1, sunshine 1.61:1,
 * sky 1.55:1 and seafoam 1.49:1 fail outright. Deferred to the pre-launch a11y
 * pass — ARCHITECTURE.md's color rule is the fix (ink on everything but pine).
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
  anchorId,
}: SectionBandBlock) {
  const isPrimary = level === 'primary';

  return (
    <section
      id={anchorId}
      className={`${BAND_BG[color]} my-[var(--spacing-section)] ${
        isPrimary ? 'py-[var(--spacing-block)]' : 'py-[var(--spacing-gutter)]'
      }`}
    >
      <div className="container-page text-center">
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
