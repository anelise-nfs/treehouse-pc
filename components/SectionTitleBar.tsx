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
 * CONTRAST: provisional. White on the fill is the worst pairing in either
 * section that uses this — tangerine 3.20:1, lime 2.00:1. --text-h3 is 24px on
 * desktop, so tangerine alone clears the 3:1 large-text bar there; at 20px on
 * mobile nothing here does, and 600 weight is not the bold that would lower the
 * threshold to 18.66px.
 */
export function SectionTitleBar({ title, color, align }: SectionTitleBarProps) {
  return (
    <div className={`container-page ${CONTENT_INSET}`}>
      <div
        className={`${BAND_BG[color]} px-[var(--spacing-block)] py-4 ${
          align === 'left' ? 'text-left' : 'text-right'
        }`}
      >
        <h2 className="font-sans text-[length:var(--text-h3)] font-semibold leading-[var(--leading-heading)] text-white">
          {title}
        </h2>
      </div>
    </div>
  );
}
