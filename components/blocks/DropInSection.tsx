import type { BandColor, DropInSectionBlock, PriceBadge } from '@/types/content';
import { PortableText } from '@/components/PortableText';
import { SectionTitleBar } from '@/components/SectionTitleBar';
import { CONTENT_INSET } from '@/components/layout';
import { DecorationLayer } from '@/components/doodles/DecorationLayer';

/**
 * Ring and label colour per badge. Literal class names because Tailwind only
 * emits what it can see in the source.
 *
 * Both read `labelColor`. The outlined badge has one colour, where the filled
 * version had two — see the note on Badge.
 */
const RING: Record<BandColor, string> = {
  pine: 'border-pine text-pine',
  mint: 'border-mint text-mint',
  tangerine: 'border-tangerine text-tangerine',
  flamingo: 'border-flamingo text-flamingo',
  seafoam: 'border-seafoam text-seafoam',
  sunshine: 'border-sunshine text-sunshine',
  lime: 'border-lime text-lime',
  tomato: 'border-tomato text-tomato',
  sky: 'border-sky text-sky',
  ocean: 'border-ocean text-ocean',
};

/**
 * One price badge: an outlined circle holding the label, its qualifier and the
 * price.
 *
 * Outlined rather than filled, and that change pays for itself twice. The
 * filled version put white on a brand colour, which passed only because the
 * label and price were both large enough for WCAG's 3:1 bar — the size was
 * doing the work, and shrinking either would have broken it. On linen there is
 * no such constraint: ink is 16.78:1 and ink-soft 8.58:1 at any size. It also
 * frees the qualifier to come inside the circle, since it no longer has to
 * escape a pale fill to stay readable.
 *
 * ONE COLOUR, NOT TWO. The filled badge had `labelColor` and `priceColor` for
 * its two halves. A ring has one edge, so `priceColor` is no longer rendered
 * by this component — see the note on PriceBadge.
 *
 * The label keeps the badge's colour: it is script, which floors at 28px, so
 * the 3:1 large-text bar applies and the three colours in use clear it on
 * linen (pine 6.42:1, ocean 3.44:1, tangerine 4.50:1). The ring clears the
 * same 3:1 that 1.4.11 asks of a meaningful graphic.
 *
 * aspect-square with centred content, so circles stay circles and a longer
 * price does not stretch one out of line with its neighbours.
 */
function Badge({ badge }: { badge: PriceBadge }) {
  return (
    <div
      className={`mx-auto flex aspect-square w-full max-w-52 flex-col items-center justify-center gap-1 rounded-full border-4 px-6 text-center sm:max-w-64 ${RING[badge.labelColor]}`}
    >
      {/* --text-script-badge, not the subsection size: at 43px the longer
          labels run to the curve inside a 256px circle. Still at the 28px
          script floor on mobile. */}
      <p className="font-script text-[length:var(--text-script-badge)] leading-[var(--leading-heading)]">
        {badge.label}
      </p>

      {badge.note ? (
        <p className="font-sans text-[length:var(--text-ui)] leading-[1.35] text-ink-soft">
          {badge.note}
        </p>
      ) : null}

      <p className="font-sans text-[length:var(--text-h2)] leading-[var(--leading-heading)] text-ink">
        {badge.price}
      </p>
    </div>
  );
}

/**
 * Drop-in pricing: title bar, three price badges, and the copy explaining how
 * walk-ins and timed entry work.
 *
 * The title bar is left-aligned here where the membership section's is right —
 * the only difference between the two, which is why it is a shared component.
 */
export function DropInSection({
  title,
  titleBandColor,
  badges,
  body,
  footnote,
  decorations,
  anchorId,
}: DropInSectionBlock) {
  return (
    <section id={anchorId} data-reveal
      className="relative my-[var(--spacing-section)]">
      <DecorationLayer decorations={decorations} />
      <SectionTitleBar title={title} color={titleBandColor} align="left" />

      <div className={`container-page ${CONTENT_INSET} mt-[var(--spacing-block)]`}>
        {/* auto-fit, not a breakpoint: the label is script, which floors at 28px
            (ARCHITECTURE.md -> Typography roles), so a circle under ~13rem clips
            its own text. Fixing a column count at `sm` did exactly that between
            640 and ~1000px. This never produces a circle too small for its
            label — 1 across on a phone, 2 on a tablet, 3 once there is room. */}
        <div className="grid gap-[var(--spacing-block)] grid-cols-[repeat(auto-fit,minmax(13rem,1fr))]">
          {badges.map((badge) => (
            <Badge key={badge._key} badge={badge} />
          ))}
        </div>

        <PortableText
          blocks={body}
          className="measure mx-auto mt-[var(--spacing-section)] text-center font-serif text-[length:var(--text-lead)] text-ink"
        />

        {footnote ? (
          <p className="measure mx-auto mt-[var(--spacing-block)] text-center font-sans text-[length:var(--text-ui)] text-ink-soft">
            {footnote}
          </p>
        ) : null}
      </div>
    </section>
  );
}
