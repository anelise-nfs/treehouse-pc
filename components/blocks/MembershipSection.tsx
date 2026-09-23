import type { MembershipSectionBlock, PricingTier } from '@/types/content';
import { CtaLink } from '@/components/CtaLink';
import { PortableText } from '@/components/PortableText';
import { BAND_BG, SectionTitleBar } from '@/components/SectionTitleBar';
import { CONTENT_INSET } from '@/components/layout';

/** Whole dollars. No currency library for one symbol — see Dependency discipline. */
function money(amount: number): string {
  return `$${amount}`;
}

/**
 * One tier: a name bar locked to the price row beneath it.
 *
 * The two halves are a single unit by design — they share a width and sit flush,
 * so they are rendered together here rather than being separately stylable.
 */
function TierCard({ tier }: { tier: PricingTier }) {
  return (
    // Rounded on the outer wrapper with overflow-hidden, so the two colored
    // halves clip to the curve and the pair reads as one card. Same radius as
    // the map and the hero band — every colored graphic on the page shares it.
    <div className="overflow-hidden rounded-[var(--radius-card)]">
      {/* CONTRAST: provisional. White script on the header fill fails AA —
          lime 2.00:1, sunshine 1.61:1, tangerine 3.20:1 (large-text bar only). */}
      <p
        className={`${BAND_BG[tier.headerColor]} px-[var(--spacing-gutter)] py-2 text-center font-script text-[length:var(--text-script-sm)] leading-[var(--leading-heading)] text-white`}
      >
        {tier.name}
      </p>

      {/* CONTRAST: provisional across this whole row. On the price fills
          (sky, mint, flamingo) white is 1.55 / 2.15 / 2.34:1 and the tangerine
          current-amount is 2.06 / 1.49 / 1.37:1. All fail AA at any size. */}
      <div
        className={`${BAND_BG[tier.priceColor]} flex items-center justify-center gap-4 px-[var(--spacing-gutter)] py-3`}
      >
        {tier.compareAtAmount ? (
          <s className="font-sans text-[length:var(--text-h3)] text-white decoration-tangerine decoration-2">
            {money(tier.compareAtAmount)}
          </s>
        ) : null}

        <p className="text-center">
          <span className="block font-sans text-[length:var(--text-h2)] font-semibold text-tangerine">
            {money(tier.amount)}
          </span>
          <span className="block font-sans text-[length:var(--text-ui)] text-white">
            a {tier.interval}
          </span>
        </p>
      </div>
    </div>
  );
}

/**
 * The whole founding-membership section: title band, tier cards, and the
 * intro/CTA/perks column.
 *
 * One block rather than three because the arrangement is fixed. The title band
 * runs the width of the content column and the two columns below sit inside it,
 * weighted 1:2 so the taller text column runs closer to the height of the cards.
 * Both collapse to one column in reading order on mobile.
 *
 * The mockup's CTA sits on a sewing-button graphic. That asset is not licensed,
 * so this renders the standard pill button and nothing else.
 */
export function MembershipSection({
  title,
  titleBandColor,
  tiers,
  tiersFootnote,
  intro,
  cta,
  perksTitle,
  perks,
  anchorId,
}: MembershipSectionBlock) {
  return (
    <section id={anchorId} className="my-[var(--spacing-section)]">
      <SectionTitleBar title={title} color={titleBandColor} align="right" />

      <div
        className={`container-page ${CONTENT_INSET} mt-[var(--spacing-block)] grid items-start gap-[var(--spacing-block)] md:grid-cols-[1fr_2fr]`}
      >
        <div className="flex flex-col gap-[var(--spacing-block)]">
          {tiers.map((tier) => (
            <TierCard key={tier._id} tier={tier} />
          ))}

          {tiersFootnote ? (
            <p className="text-center font-sans text-[length:var(--text-ui)] text-ink-soft">
              {tiersFootnote}
            </p>
          ) : null}
        </div>

        <div className="text-center">
          <PortableText
            blocks={intro}
            className="font-serif text-[length:var(--text-lead)] text-ink"
          />

          <p className="mt-[var(--spacing-gutter)]">
            <CtaLink link={cta} />
          </p>

          <h3 className="mt-[var(--spacing-block)] font-script text-[length:var(--text-script-sm)] leading-[var(--leading-heading)] text-ink">
            {perksTitle}
          </h3>

          <ul className="mt-[var(--spacing-block)] flex flex-col gap-[var(--spacing-gutter)]">
            {perks.map((perk) => (
              <li key={perk._key}>
                {/* CONTRAST: provisional. The perk label is lime on linen at
                    1.92:1, well under AA at this size. */}
                <p className="font-sans text-[length:var(--text-ui)] font-semibold text-lime">
                  {perk.label}
                </p>
                <p className="font-serif text-[length:var(--text-body)] text-ink">
                  {perk.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
