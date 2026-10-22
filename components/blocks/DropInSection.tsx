import type { DropInSectionBlock, PriceBadge } from '@/types/content';
import { PortableText } from '@/components/PortableText';
import { BAND_BG, SectionTitleBar } from '@/components/SectionTitleBar';
import { CONTENT_INSET } from '@/components/layout';
import { DecorationLayer } from '@/components/doodles/DecorationLayer';

/**
 * One price badge: a label half above a price half.
 *
 * A circle at every width. It stays one at phone sizes because the grid gives it
 * a full column there — roughly 250px, comfortably above the ~208px its script
 * label needs — so the rectangular fallback this used to drop to is no longer
 * earning anything.
 *
 * The two halves split the circle exactly, which is why the height comes from
 * `aspect-square` rather than from the content: text of different lengths
 * ('$28' against 'free with sibling') must not move the divide.
 */
/*
 * Circle size on phones is set by the label's clearance, not by taste. The
 * script face floors at 28px (ARCHITECTURE.md -> Typography roles) and the
 * longest label measures 118px there, so it cannot be shrunk to fit. What can
 * change is the circle: at the height the label sits, a circle is narrower than
 * its diameter, so 176px left only 17px each side where 208px leaves 31px.
 */
function Badge({ badge }: { badge: PriceBadge }) {
  return (
    <div className="flex flex-col items-center">
      <div className="aspect-square w-full max-w-52 overflow-hidden rounded-full sm:max-w-64">
        {/* The label is white on the fill at script size, which floors at 28px
            and so needs 3:1, not 4.5:1. The three in use clear it: pine 6.66:1,
            ocean 3.56:1, tangerine 4.67:1. Seafoam would not — it is 1.49:1 —
            so it is not an option for this slot. */}
        <div
          className={`${BAND_BG[badge.labelColor]} flex h-1/2 flex-col items-center justify-end px-4 pb-4 pt-4 text-center sm:px-6`}
        >
          {/* --text-script-badge, not the subsection size: at 43px the longer
              labels run to the curve inside a 256px circle. Still at the 28px
              script floor on mobile. */}
          <p className="font-script text-[length:var(--text-script-badge)] leading-[var(--leading-heading)] text-white">
            {badge.label}
          </p>
        </div>

        {/* CONTRAST: provisional. White on the price fills fails AA at any size —
            flamingo 2.34:1, lime 2.00:1, sky 1.55:1. */}
        <div
          className={`${BAND_BG[badge.priceColor]} flex h-1/2 items-center justify-center px-4 pb-4 pt-4 text-center sm:px-6`}
        >
          <span className="font-sans text-[length:var(--text-h2)] leading-[var(--leading-heading)] text-white">
            {badge.price}
          </span>
        </div>
      </div>

      {/* The qualifier sits below the circle in ink rather than inside it in
          white: on the pale fills it was the least readable text on the badge,
          and ink on linen is 16.78:1. It also frees the circle to carry just the
          label and the price. */}
      {badge.note ? (
        <p className="mt-[var(--spacing-gutter)] text-center font-sans text-[length:var(--text-body)] text-ink">
          {badge.note}
        </p>
      ) : null}
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
