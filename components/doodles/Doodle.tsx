import type { CSSProperties } from 'react';
import type { BandColor } from '@/types/content';
import { DOODLE_SHAPES, type DoodleName, type DoodleShape } from './shapes';

/**
 * Brand token per doodle colour. Kept as a literal map because Tailwind needs to
 * see the class names to emit them.
 */
const DOODLE_COLOR: Record<BandColor, string> = {
  pine: 'text-pine',
  mint: 'text-mint',
  tangerine: 'text-tangerine',
  flamingo: 'text-flamingo',
  seafoam: 'text-seafoam',
  sunshine: 'text-sunshine',
  lime: 'text-lime',
  tomato: 'text-tomato',
  sky: 'text-sky',
  ocean: 'text-ocean',
};

export interface DoodleProps {
  name: DoodleName;
  /** Defaults to the colour the doodle was drawn in. */
  color?: BandColor;
  /**
   * Opt into the settle-in entrance. Only decoration-layer doodles want it — the
   * button hover mark has its own fade and would fight this one.
   */
  enter?: boolean;
  /** Per-doodle entrance variation, as CSS custom properties. */
  style?: CSSProperties;
  className?: string;
}

/**
 * One decorative mark.
 *
 * Purely atmospheric: it is marked aria-hidden and never focusable, so it is
 * invisible to assistive technology and to the tab order. Removing any doodle
 * has no consequence for meaning or layout.
 *
 * `fill="currentColor"` is what makes the token colour apply — the source SVGs
 * carry their own fills, which the generator strips.
 */
export function Doodle({ name, color, enter, style, className = '' }: DoodleProps) {
  // Widened from the `as const` literal: only one doodle has circles, and the
  // narrowed type would hide that field on every other entry.
  const shape: DoodleShape = DOODLE_SHAPES[name];
  const tone = DOODLE_COLOR[(color ?? shape.defaultColor) as BandColor];

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="presentation"
      data-doodle-enter={enter ? '' : undefined}
      style={style}
      viewBox={shape.viewBox}
      fill="currentColor"
      className={`${tone} ${className}`}
    >
      {shape.paths.map((d) => (
        <path key={d.slice(0, 24)} d={d} />
      ))}
      {shape.circles?.map((c) => (
        <circle key={`${c.cx}-${c.cy}`} cx={c.cx} cy={c.cy} r={c.r} />
      ))}
    </svg>
  );
}
