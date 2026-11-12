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
 *
 * The top offset is deeper than the bottom one. Blocks centre their copy
 * vertically, so a tall mark bleeding upward still met the heading at -8; the
 * marks that bleed downward sit under a paragraph that ends higher and clear it
 * at that distance. Measured against the heading's glyph box, not its element
 * box, which is taller than the text it holds.
 */
const SLOT_BLEED: Partial<Record<DoodleSlot, string>> = {
  'top-left': 'left-2 -top-24',
  'top-right': 'right-2 -top-24',
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

/**
 * Doodle widths, keyed by the size an author picks.
 *
 * These size the *width*. A doodle's height follows its own aspect ratio, so a
 * tall narrow shape reads much larger than a wide flat one at the same step.
 *
 * `md` and `lg` are double what they originally were. `sm` was left behind at
 * 48px when they grew, which put a 112px hole in the middle of the scale: the
 * sub-page header wanted a mark smaller than the default without it vanishing,
 * and there was nothing between the two. `sm` moved into that gap and `xs`
 * took its old value, so nothing that was 48px had to change size — only its
 * name.
 */
const WIDTH: Record<NonNullable<Decoration['size']>, string> = {
  xs: 'w-12',
  sm: 'w-24',
  md: 'w-40',
  lg: 'w-56',
};
/**
 * Smallest viewport the layer appears at. 'md' is the site-wide default, set by
 * ARCHITECTURE.md → Mobile: these are margin decoration and a phone has no
 * margin to spare.
 *
 * 'lg' is for a block whose two columns only split at lg. While such a block is
 * stacked, its copy spans the full width and the corner slots are no longer
 * margin at all — they are on top of the text.
 */
const VISIBILITY = {
  md: 'hidden md:block',
  lg: 'hidden lg:block',
} as const;

/**
 * The box the slots are corners of.
 *
 * 'gutter' is the site-wide default: the page gutter on both sides, the
 * block's full height. Doodles then stop at the same edge the page's content
 * respects instead of running up against the viewport.
 *
 * 'header' is the sub-page opener's title column. Its left and bottom edges
 * match 'gutter', so a bottom-left mark lands in the same place, but the top
 * and right are pulled off the corner — that column is short and its title is
 * vertically centred, so a mark tight into the top-right corner sat up against
 * the nav bar above it. Nudging the bounds rather than the slot keeps this to
 * one caller: the slot map is shared by every block on the site.
 */
const BOUNDS = {
  gutter: 'inset-y-0 left-[var(--spacing-gutter)] right-[var(--spacing-gutter)]',
  header: 'bottom-0 top-6 left-[var(--spacing-gutter)] right-2',
} as const;

export interface DecorationLayerProps {
  decorations?: Decoration[];
  /** See VISIBILITY. Defaults to the site-wide 'md'. */
  from?: keyof typeof VISIBILITY;
  /** See BOUNDS. Defaults to the site-wide 'gutter'. */
  bounds?: keyof typeof BOUNDS;
  /**
   * The settle-in entrance every other block's doodles use. Defaults on.
   * Switched off by a block that is deliberately static — the sub-page header
   * animates nothing, and marks drifting into place would be the only movement
   * on it.
   */
  enter?: boolean;
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
export function DecorationLayer({
  decorations,
  from = 'md',
  bounds = 'gutter',
  enter = true,
}: DecorationLayerProps) {
  if (!decorations || decorations.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      // Which edges the slots measure from is set by BOUNDS above, not here.
      //
      // The clip-path is horizontal-only — sides at the layer's edge, top and
      // bottom pushed far outside it. That keeps the guarantee that matters (a
      // doodle can never widen the document and raise a horizontal scrollbar)
      // while letting one taller than its block hang past it. `overflow-hidden`
      // cannot express this: setting one axis to hidden forces the other to
      // scroll, and it was slicing the flat bottom off any tall doodle in a
      // short block.
      className={`pointer-events-none absolute z-0 select-none [clip-path:inset(-100vh_0_-100vh_0)] ${BOUNDS[bounds]} ${VISIBILITY[from]}`}
    >
      {decorations.map((decoration, index) => (
        <Doodle
          // Index-keyed deliberately: the same doodle may appear twice on a
          // block, and this list is static decoration that never reorders.
          key={`${decoration.doodle}-${decoration.slot}-${index}`}
          name={decoration.doodle}
          color={decoration.color}
          enter={enter}

          style={(() => {
            const { tilt, delay } = variation(`${decoration.doodle}-${decoration.slot}-${index}`);
            return { '--doodle-tilt': `${tilt}deg`, '--doodle-delay': `${delay}ms` } as CSSProperties;
          })()}
          className={`absolute ${
            (decoration.bleed ? SLOT_BLEED[decoration.slot] : undefined) ?? SLOT[decoration.slot]
          } ${WIDTH[decoration.size ?? 'md']}`}
        />
      ))}
    </div>
  );
}
