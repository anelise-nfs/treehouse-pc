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
  // CONTRAST: provisional (ocean on linen 3.44:1 — clears the 3:1 large-text bar only).
  ocean: 'text-ocean',
  // CONTRAST: provisional (tomato on linen 3.72:1 — clears the 3:1 large-text bar only).
  tomato: 'text-tomato',
  // CONTRAST: provisional (tangerine on linen 3.09:1 — clears the 3:1 large-text bar only).
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
 * CONTRAST: the client's chosen heading colors are below the 4.5:1 AA needs for
 * normal text. They are not below the 3:1 large-text bar, and --text-script-sm
 * cannot render under 28px, so as built these clear AA at the large-text
 * threshold. Retained as-drawn pending the pre-launch accessibility pass.
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
      className="container-page relative grid items-center gap-[var(--spacing-block)] my-[var(--spacing-section)] md:grid-cols-2"
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
