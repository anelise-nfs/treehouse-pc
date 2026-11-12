import type { BandColor } from '@/types/content';
import { CONTENT_INSET } from '@/components/layout';

export const BAND_BG: Record<BandColor, string> = {
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

export interface SectionTitleBarProps {
  title: string;
  color: BandColor;
  /** Which edge the label sits against. Set per section by the design. */
  align: 'left' | 'right';
}

/**
 * The colored header bar that opens a self-contained section block.
 *
 * Shared rather than copied: it belongs to more than one block and the design
 * has been tuned repeatedly, so a second copy would drift. Held to the content
 * column, not bled to the viewport edges — a full-bleed bar reads as a
 * standalone sectionBand marking the page, where this one is a section's own
 * header and has to sit visibly on top of what follows it.
 *
 * Sans, not the script face: the client's design reserves script for the
 * labels inside these sections.
 *
 * CONTRAST: white on the fill, at 24px from --text-aa-large, so the 3:1
 * large-text bar applies. The two fills in use measure tangerine 4.67:1 and
 * lime 3.14:1 — tangerine clears 4.5:1 outright, lime passes as large text
 * only. See the note on the heading below for why the size is fixed at 24px
 * rather than following the type scale.
 *
 * 600 weight does not help: WCAG's lower 18.66px threshold needs bold, which
 * is 700.
 *
 * The earlier figures here — tangerine 3.20, lime 2.00, and a 20px mobile size
 * — predate both the palette darkening and the move to --text-aa-large.
 */
export function SectionTitleBar({ title, color, align }: SectionTitleBarProps) {
  return (
    <div className={`container-page ${CONTENT_INSET}`}>
      <div
        className={`${BAND_BG[color]} rounded-[var(--radius-card)] px-[var(--spacing-block)] py-4 ${
          align === 'left' ? 'text-left' : 'text-right'
        }`}
      >
        {/* --text-aa-large, not --text-h3: this previously dropped to
            --text-lead (18px) on phones to keep the longest title we expect
            ('early bird gets the worm') on one line, but 18px put white on the
            lime fill at 3.14:1 against a 4.5:1 requirement. 24px clears the bar
            as large text instead, at the cost of that title wrapping to two
            lines on a phone. Unchanged at desktop width. */}
        <h2 className="font-sans text-[length:var(--text-aa-large)] font-semibold leading-[var(--leading-heading)] text-white">
          {title}
        </h2>
      </div>
    </div>
  );
}
