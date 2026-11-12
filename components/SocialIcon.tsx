import type { ReactNode } from 'react';
import type { SocialPlatform } from '@/types/content';

/**
 * Platform glyphs, drawn inline.
 *
 * Hand-written rather than pulled from an icon package or a CDN — see
 * ARCHITECTURE.md → Dependency discipline. A handful of shapes do not justify
 * a dependency to upgrade, and a CDN would add a third-party request to every
 * page view for artwork that never changes.
 *
 * Each is drawn on a 24×24 grid in `currentColor`, so the glyph takes the
 * colour of whatever it sits in. In the footer that is white on pine, the one
 * brand fill white is safe on at any size.
 *
 * TWO CORRECTIONS ARE BAKED IN, both of which look like mistakes if you only
 * read the numbers:
 *
 *   Facebook is scaled up 10%. Measured, all three glyphs had near-identical
 *   bounding boxes (19.7, 20.0, 19.5 units wide) — yet the circle read
 *   visibly smaller than the square beside it. A disc carries less mass than
 *   a square of the same width because it has no corners, so matching the
 *   boxes is what makes them look mismatched. The scale is about the centre,
 *   so the glyph stays put.
 *
 *   Instagram is stroked rather than filled. The official mark's outline is
 *   about 1.5 units on this grid, which at the 20px this renders at comes to
 *   1.25 device pixels — hairline, and far lighter than the two solid marks
 *   next to it. Drawing it as a stroke puts the weight under our control at
 *   2 units, which reads at the same strength as its neighbours while keeping
 *   the mark's shape.
 *
 * TRADEMARKS. These are the companies' own marks, used to link to the
 * company's own profile, which is what their brand guidelines permit. All
 * allow a flat single-colour version, which is what these are. Do not
 * recolour them to a brand colour or restyle them further; if a platform
 * changes its mark, replace the shape here rather than approximating it.
 */
const ICONS: Record<SocialPlatform, ReactNode> = {
  instagram: (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* 18 wide plus a 2-wide stroke straddling the edge reaches 20 units,
          matching the drawn width of the solid marks. */}
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="16.9" cy="7.1" r="1.2" fill="currentColor" stroke="none" />
    </g>
  ),
  facebook: (
    <path
      transform="translate(12 12) scale(1.1) translate(-12 -12)"
      d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z"
    />
  ),
  // X, formerly Twitter. The mark, not the old bird.
  x: (
    <path d="M17.53 3h3.04l-6.64 7.59L21.75 21h-6.11l-4.79-6.26L5.37 21H2.33l7.1-8.12L2.25 3h6.27l4.33 5.72L17.53 3Zm-1.07 16.17h1.69L7.6 4.73H5.79l10.67 14.44Z" />
  ),
  tiktok: (
    <path d="M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.1v11.67a2.47 2.47 0 1 1-1.77-2.37V9.14a5.56 5.56 0 1 0 4.87 5.53V8.9a7.3 7.3 0 0 0 4.26 1.36V7.17a4.28 4.28 0 0 1-3.2-1.35Z" />
  ),
  youtube: (
    <path d="M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.42a2.5 2.5 0 0 0-1.76 1.77C2 8.77 2 12 2 12s0 3.23.42 4.81a2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77C22 15.23 22 12 22 12s0-3.23-.42-4.81ZM10 15.02V8.98L15.2 12 10 15.02Z" />
  ),
};

export interface SocialIconProps {
  platform: SocialPlatform;
  className?: string;
}

/**
 * aria-hidden with no title: every use of this sits inside a link or a label
 * that already carries the platform name, so announcing it again would read
 * the name twice.
 */
export function SocialIcon({ platform, className = '' }: SocialIconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      {ICONS[platform]}
    </svg>
  );
}
