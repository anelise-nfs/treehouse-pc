import type { MembershipSectionBlock, PricingTier } from '@/types/content';
import { CtaLink } from '@/components/CtaLink';
import { PortableText } from '@/components/PortableText';
import { BAND_BG, SectionTitleBar } from '@/components/SectionTitleBar';
import { CONTENT_INSET } from '@/components/layout';
import { DecorationLayer } from '@/components/doodles/DecorationLayer';

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
      {/* White script on the header fill. The script face floors at ~28px, so
          this is large text and needs 3:1, not 4.5:1. The three in use clear it:
          lime 3.14:1, pine 6.66:1, tangerine 4.67:1. */}
      <p
        className={`${BAND_BG[tier.headerColor]} px-[var(--spacing-gutter)] py-2 text-center font-script text-[length:var(--text-script-sm)] leading-[var(--leading-heading)] text-white`}
      >
        {tier.name}
      </p>

      {/* The amount is white, not tangerine. Against the darkened price fills
          tangerine measured 1.02–1.03:1 — effectively invisible — where white is
          3.11–3.14:1 and clears the large-text bar at this size.

          The struck-through amount moved to --text-aa-large for the same
          reason — see the note on it below.

          `tier.interval` is deliberately not rendered: the cards no longer say
          "a month" and the footnote below carries the billing terms instead. */}
      <div
        className={`${BAND_BG[tier.priceColor]} flex items-center justify-center gap-4 px-[var(--spacing-gutter)] py-3`}
      >
        {/* --text-aa-large, not --text-h3: at --text-h3's 20px mobile step the
            compare-at price was white on the price fill at 3.11-3.13:1, needing
            4.5:1. Same 24px as before on desktop. The live price beside it stays
            --text-h2, so on phones the two match in size and the weight
            difference and strikethrough carry the hierarchy. */}
        {tier.compareAtAmount ? (
          <s className="font-sans text-[length:var(--text-aa-large)] text-white decoration-white decoration-2">
            {money(tier.compareAtAmount)}
          </s>
        ) : null}

        <p className="text-center">
          <span className="block font-sans text-[length:var(--text-h2)] font-semibold text-white">
            {money(tier.amount)}
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
  decorations,
  anchorId,
}: MembershipSectionBlock) {
  return (
    <section id={anchorId} data-reveal
      className="relative my-[var(--spacing-section)]">
      <DecorationLayer decorations={decorations} />
      {title ? (
        <SectionTitleBar title={title} color={titleBandColor ?? 'tangerine'} align="right" />
      ) : null}

      <div
        className={`container-page ${CONTENT_INSET} ${title ? 'mt-[var(--spacing-block)]' : ''} grid items-start gap-[var(--spacing-block)] md:grid-cols-[1fr_2fr]`}
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

          {/* h2, not h3: on /early-bird no title bar precedes this, so an h3
              jumped straight from the page h1. */}
          <h2 className="mt-[var(--spacing-block)] font-script text-[length:var(--text-script-sm)] leading-[var(--leading-heading)] text-ink">
            {perksTitle}
          </h2>

          <ul className="mt-[var(--spacing-block)] flex flex-col gap-[var(--spacing-gutter)]">
            {perks.map((perk) => (
              <li key={perk._key}>
                {/* Pine, not lime: lime on linen is 3.02:1 and fails at this
                    size, and lime cannot be darkened enough to pass without
                    arriving at pine anyway. Pine is 6.42:1. */}
                <p className="font-sans text-[length:var(--text-ui)] font-semibold text-pine">
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
