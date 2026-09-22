import type { DropInSectionBlock, PriceBadge } from '@/types/content';
import { PortableText } from '@/components/PortableText';
import { BAND_BG, SectionTitleBar } from '@/components/SectionTitleBar';
import { CONTENT_INSET } from '@/components/layout';

/**
 * One price badge: a label half above a price half.
 *
 * A circle on desktop and a full-width card below 640px, per ARCHITECTURE.md →
 * Mobile. The two halves split the circle exactly, which is why the height comes
 * from `aspect-square` rather than from the content — text of different lengths
 * ('$28' against 'free with sibling') must not move the divide.
 */
function Badge({ badge }: { badge: PriceBadge }) {
  return (
    <div className="mx-auto w-full max-w-64 overflow-hidden rounded-[var(--radius-card)] sm:aspect-square sm:rounded-full">
      {/* CONTRAST: provisional. White on the label fills fails AA at any size —
          seafoam 1.49:1, ocean 3.56:1 (large-text bar only), sunshine 1.61:1. */}
      <div
        className={`${BAND_BG[badge.labelColor]} flex flex-col items-center justify-center px-6 py-4 text-center sm:h-1/2 sm:justify-end sm:pb-4`}
      >
        {/* --text-script-badge, not the subsection size: at 43px the longer
            labels run to the curve inside a 256px circle. Still at the 28px
            script floor on mobile. */}
        <p className="font-script text-[length:var(--text-script-badge)] leading-[var(--leading-heading)] text-white">
          {badge.label}
        </p>
        {badge.note ? (
          <p className="font-sans text-[length:var(--text-caption)] text-white">{badge.note}</p>
        ) : null}
      </div>

      {/* CONTRAST: provisional. White on the price fills fails AA at any size —
          flamingo 2.34:1, lime 2.00:1, sky 1.55:1. */}
      <div
        className={`${BAND_BG[badge.priceColor]} flex items-center justify-center px-6 py-4 text-center sm:h-1/2 sm:pt-4`}
      >
        <p className="text-center">
          <span className="block font-sans text-[length:var(--text-h2)] leading-[var(--leading-heading)] text-white">
            {badge.price}
          </span>
          {badge.priceNote ? (
            <span className="block font-sans text-[length:var(--text-caption)] text-white">
              {badge.priceNote}
            </span>
          ) : null}
        </p>
      </div>
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
  anchorId,
}: DropInSectionBlock) {
  return (
    <section id={anchorId} className="my-[var(--spacing-section)]">
      <SectionTitleBar title={title} color={titleBandColor} align="left" />

      <div className={`container-page ${CONTENT_INSET} mt-[var(--spacing-block)]`}>
        <div className="grid gap-[var(--spacing-block)] sm:grid-cols-3">
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
