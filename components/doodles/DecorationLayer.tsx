import type { CSSProperties } from 'react';
import type { Decoration, DoodleSlot } from '@/types/content';
import { Doodle } from './Doodle';

/**
 * Where each named slot sits inside its block.
 *
 * Named slots rather than free coordinates: an author picks a corner, not an
 * offset, so a placement cannot be dragged into the middle of a paragraph or
 * off the edge. The values below are the whole positioning vocabulary.
 *
 * Offsets are positive, inside the block's own bounds. Negative offsets read as
 * more natural "margin atmosphere", but they push past the viewport edge and
 * extend the document's scroll width — measured at 1440, doodles alone took the
 * page from 1440 to 1472 and introduced a horizontal scrollbar. Decoration must
 * never do that. At wide viewports these still land in the page gutter outside
 * the content column, which is the effect the negative values were reaching for.
 */
const SLOT: Record<DoodleSlot, string> = {
  'top-left': 'left-2 top-2',
  'top-right': 'right-2 top-2',
  'bottom-left': 'bottom-2 left-2',
  'bottom-right': 'bottom-2 right-2',
  left: 'left-2 top-1/2 -translate-y-1/2',
  right: 'right-2 top-1/2 -translate-y-1/2',
};

/**
 * Bleeding variants: same horizontal placement, lifted past the block's edge.
 * Only the vertical offset changes — see `bleed` on Decoration for why.
 */
const SLOT_BLEED: Partial<Record<DoodleSlot, string>> = {
  'top-left': 'left-2 -top-8',
  'top-right': 'right-2 -top-8',
  'bottom-left': '-bottom-8 left-2',
  'bottom-right': '-bottom-8 right-2',
};

/**
 * Stable pseudo-random from the doodle's own identity.
 *
 * Deterministic on purpose: a value drawn at render time would differ between
 * server and client and would change on every re-render. This gives each
 * placement a fixed tilt and delay that survive both.
 */
function variation(seed: string) {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const positive = Math.abs(hash);
  // ±18–38 degrees, and up to 200ms of stagger.
  const magnitude = 18 + (positive % 21);
  const tilt = positive % 2 === 0 ? magnitude : -magnitude;
  return { tilt, delay: (positive >> 3) % 200 };
}

export interface DecorationLayerProps {
  decorations?: Decoration[];
}

/**
 * The decorative layer for one block.
 *
 * Absolutely positioned inside a `relative` block wrapper and behind content, so
 * it occupies no flow space and can never shift layout. `pointer-events-none`
 * keeps it from intercepting clicks, and every doodle inside is aria-hidden.
 *
 * `overflow-hidden` is a hard guarantee rather than a style choice: whatever a
 * future slot value is, nothing in this layer can escape the block and widen the
 * page.
 *
 * Hidden below `md` per ARCHITECTURE.md → Mobile: these are margin decoration
 * and a phone has no margin to spare.
 *
 * Returns null when a block has no decorations, so nothing is emitted at all.
 */
export function DecorationLayer({ decorations }: DecorationLayerProps) {
  if (!decorations || decorations.length === 0) return null;

  // Clipping is the default guarantee. A layer only opens up when something in
  // it is meant to hang outside, and even then every horizontal offset stays
  // non-negative, so the document cannot get wider.
  const bleeds = decorations.some((decoration) => decoration.bleed);

  return (
    <div
      aria-hidden="true"
      // Inset horizontally by the page gutter rather than filling the block:
      // doodles then stop at the same edge the page's content respects, instead
      // of running right up against the viewport. Vertical stays flush so a
      // `bleed` doodle can still hang past the top or bottom.
      className={`pointer-events-none absolute inset-y-0 left-[var(--spacing-gutter)] right-[var(--spacing-gutter)] z-0 hidden select-none md:block ${
        bleeds ? '' : 'overflow-hidden'
      }`}
    >
      {decorations.map((decoration, index) => (
        <Doodle
          // Index-keyed deliberately: the same doodle may appear twice on a
          // block, and this list is static decoration that never reorders.
          key={`${decoration.doodle}-${decoration.slot}-${index}`}
          name={decoration.doodle}
          color={decoration.color}
          enter

          style={(() => {
            const { tilt, delay } = variation(`${decoration.doodle}-${decoration.slot}-${index}`);
            return { '--doodle-tilt': `${tilt}deg`, '--doodle-delay': `${delay}ms` } as CSSProperties;
          })()}
          className={`absolute ${
            (decoration.bleed ? SLOT_BLEED[decoration.slot] : undefined) ?? SLOT[decoration.slot]
          } ${
            decoration.size === 'lg' ? 'w-28' : decoration.size === 'sm' ? 'w-12' : 'w-20'
          }`}
        />
      ))}
    </div>
  );
}
