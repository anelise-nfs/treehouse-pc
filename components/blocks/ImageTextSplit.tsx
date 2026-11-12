import type { ImageTextSplitBlock, SplitHeadingColor } from '@/types/content';
import { CtaLink } from '@/components/CtaLink';
import { PortableText } from '@/components/PortableText';
import { objectPosition } from '@/components/imageFraming';
import { DecorationLayer } from '@/components/doodles/DecorationLayer';

/**
 * Script heading color, mapped from the authored union to a token.
 *
 * Only pine clears AA outright as text on linen. The other three are the
 * client's as-drawn colors and are flagged below for the pre-launch pass — see
 * the block comment on the component.
 */
const HEADING_COLOR: Record<SplitHeadingColor, string> = {
  pine: 'text-pine',
  // On linen: ocean 3.44:1 — large text only.
  ocean: 'text-ocean',
  // On linen: tomato 3.72:1 — large text only.
  tomato: 'text-tomato',
  // On linen: tangerine 4.50:1 — clears AA at any size. (An earlier note here
  // said 3.09:1, measured before tangerine was darkened to #cc4800.)
  tangerine: 'text-tangerine',
};

/**
 * Image on one side, heading and body on the other.
 *
 * The fixed 4:3 container is the point of the block: source photography arrives
 * at mismatched dimensions, and letting each image set its own height leaves
 * consecutive instances visibly uneven. Every instance crops to the same shape.
 *
 * Section spacing is a margin, not padding, matching every other block. Padding
 * cannot collapse, so against a band's margin the two stacked and produced a
 * ~180px gap where neighbouring bands showed 90px.
 *
 * CONTRAST: all four heading colors pass on linen as built. Pine 6.42:1 and
 * tangerine 4.50:1 clear 4.5:1 outright; ocean 3.44:1 and tomato 3.72:1 pass
 * as large text, which they always are — --text-script-sm floors at 28px.
 *
 * So for ocean and tomato the size is the compliance. These are heading colors
 * only; the same tokens on body copy would fail.
 */
export function ImageTextSplit({
  image,
  imageSide,
  heading,
  headingColor,
  body,
  cta,
  decorations,
  anchorId,
}: ImageTextSplitBlock) {
  return (
    <section
      id={anchorId}
      data-reveal
      // 1.4x --spacing-section, not the token alone: these blocks read as
      // cramped against their neighbours at the base step. Margins collapse
      // between adjacent sections, so the larger of the two wins and the gap
      // to a neighbouring band grows with it.
      className="container-page relative grid items-center gap-[var(--spacing-block)] my-[calc(var(--spacing-section)*1.4)] md:grid-cols-2"
    >
      <DecorationLayer decorations={decorations} />
      {/* Image first in the DOM unconditionally, so mobile stacks it above the
          text whatever imageSide says. Desktop side is a reordering of these two
          columns, never a second copy of the markup. */}
      <div
        className={`aspect-[4/3] overflow-hidden ${imageSide === 'right' ? 'md:order-2' : ''}`}
      >
        <img
          src={image.url}
          alt={image.alt}
          width={image.width}
          height={image.height}
          style={{ objectPosition: objectPosition(image) }}
          className="size-full object-cover"
        />
      </div>

      <div className="text-center">
        {heading ? (
          <h2
            className={`font-script text-[length:var(--text-script-sm)] leading-[var(--leading-heading)] ${HEADING_COLOR[headingColor]}`}
          >
            {heading}
          </h2>
        ) : null}

        <PortableText
          blocks={body}
          className="mt-[var(--spacing-block)] font-serif text-[length:var(--text-body)] text-ink"
        />

        {cta ? (
          <p className="mt-[var(--spacing-block)]">
            <CtaLink link={cta} />
          </p>
        ) : null}
      </div>
    </section>
  );
}
