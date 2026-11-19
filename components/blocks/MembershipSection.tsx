import type {
  BillingInterval,
  MembershipPerk,
  MembershipSectionBlock,
  PriceInterval,
  PricingTier,
} from '@/types/content';
import { CtaLink } from '@/components/CtaLink';
import { PortableText } from '@/components/PortableText';
import { BAND_BG, SectionTitleBar } from '@/components/SectionTitleBar';
import { CONTENT_INSET } from '@/components/layout';
import { DecorationLayer } from '@/components/doodles/DecorationLayer';

/**
 * Whole dollars. No currency library for one symbol — see Dependency
 * discipline. The locale is pinned rather than left to the runtime so the
 * thousands separator the annual totals need ('$1,680') is the same in the
 * build output as it is in a browser.
 */
function money(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

/** Suffix on the headline figure, so a monthly price cannot be read as a total. */
const PER_INTERVAL: Record<PriceInterval, string> = {
  month: '/month',
  year: '/year',
};

/** How the amount actually charged is described beneath the headline figure. */
const BILLED_FOR: Record<BillingInterval, string> = {
  month: 'for the month',
  year: 'for the year',
  once: 'one time',
};

/**
 * One tier: a name bar locked to the price row beneath it, with its purchase
 * button under the pair.
 *
 * The two colored halves are a single unit by design — they share a width and
 * sit flush, so they are rendered together here rather than being separately
 * stylable. The button sits outside that clipped box, on the page background,
 * because a filled button on a brand fill has no pairing on the approved
 * contrast list; the outline variant on linen is 6.38:1.
 */
function TierCard({ tier }: { tier: PricingTier }) {
  return (
    // gap-3, not a spacing token: the button belongs to the card above it, and
    // the tokens that would fit here (--spacing-gutter, --spacing-block) both
    // reach the gap used *between* tiers, which would leave each button
    // floating equidistant from two cards.
    //
    // justify-between so that if one tier's name wraps to two lines, its button
    // still lines up with the others' rather than riding up with the shorter
    // card. The grid row stretches all three to a common height.
    <div className="flex h-full flex-col justify-between gap-3">
      {/* Rounded on the outer wrapper with overflow-hidden, so the two colored
          halves clip to the curve and the pair reads as one card. Same radius as
          the map and the hero band — every colored graphic on the page shares it. */}
      <div className="overflow-hidden rounded-[var(--radius-card)]">
        {/* White script on the header fill. The script face floors at ~28px, so
            this is large text and needs 3:1, not 4.5:1. The three in use clear it:
            lime 3.14:1, pine 6.66:1, tangerine 4.67:1.

            --text-script-badge, not --text-script-sm: side by side these cards
            are about a third the width they were stacked in a column, and
            'three+ kids' in script at the larger step wrapped. This is the same
            token the drop-in badges use, for the same reason — a script label in
            a box narrow enough to constrain it. Still clear of the 28px floor.

            px-2, not --spacing-gutter: at this width the gutter was eating a
            quarter of the card. */}
        <p
          className={`${BAND_BG[tier.headerColor]} px-2 py-2 text-center font-script text-[length:var(--text-script-badge)] leading-[var(--leading-heading)] text-white`}
        >
          {tier.name}
        </p>

        {/* The amounts are white, not tangerine. Against the darkened price fills
            tangerine measured 1.02–1.03:1 — effectively invisible — where white is
            3.11–3.14:1 and clears the large-text bar at this size.

            CONTRAST, and the reason this one fill carries two text colors: the
            white figures are all at or above --text-aa-large's 24px, so the 3:1
            large-text bar applies to them and ocean 3.56:1 / mint 3.13:1 /
            flamingo 3.11:1 pass. The annual total below them is 15px, where 3:1
            does not apply, so it is ink — 4.88:1 / 5.57:1 / 5.59:1, all clear of
            4.5:1. Neither color would pass at the other's size, which is why the
            sizes here are load-bearing. Shrink a white figure below 24px and it
            fails; see ARCHITECTURE.md → Color rule. */}
        <div className={`${BAND_BG[tier.priceColor]} px-2 py-3 text-center`}>
          {/* --text-aa-large for the struck price, not --text-h3: at --text-h3's
              20px mobile step it was white on the price fill at 3.11-3.13:1,
              needing 4.5:1. Same 24px as before on desktop. The live price beside
              it stays --text-h2, so on phones the two match in size and the
              weight difference and strikethrough carry the hierarchy.

              flex-wrap, because three cards across give this row about a third
              of the width it had in a column: if the struck price and the live
              one cannot sit side by side, they stack instead of overflowing. */}
          <p className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
            {tier.compareAtAmount ? (
              <s className="font-sans text-[length:var(--text-aa-large)] text-white decoration-white decoration-2">
                {money(tier.compareAtAmount)}
              </s>
            ) : null}

            <span className="font-sans text-[length:var(--text-h2)] font-medium text-white">
              {money(tier.amount)}
              {/* A step down from the figure it qualifies, but held at 24px so
                  it stays large text. */}
              <span className="text-[length:var(--text-aa-large)]">
                {PER_INTERVAL[tier.interval]}
              </span>
            </span>
          </p>

          {/* The whole point of this line: the headline figure is monthly, but
              the founding rate is charged a year at a time, and a family
              deciding on it needs the real number. The footnote under the cards
              states the terms; this states the amount. */}
          {tier.billedAmount && tier.billedInterval ? (
            <p className="mt-1 font-sans text-[length:var(--text-ui)] text-ink">
              {money(tier.billedAmount)} {BILLED_FOR[tier.billedInterval]}
            </p>
          ) : null}
        </div>
      </div>

      {/* Full width, so the button reads as the card's own action rather than a
          loose pill under it. Optional: a tier with nothing to buy yet renders
          as it did before. */}
      {tier.cta ? <CtaLink link={tier.cta} className="w-full" /> : null}
    </div>
  );
}

/**
 * A titled label-and-description list — 'early birds get:' and 'all members
 * will enjoy'.
 *
 * Both now sit full width below the pricing, so they are rendered by one
 * component: as siblings in the same column, any difference in treatment
 * between them would read as meaning rather than as variety. The distinction
 * the client asked for is carried by the headings.
 */
function PerkGroup({
  title,
  perks,
  className = '',
}: {
  title: string;
  perks: MembershipPerk[];
  className?: string;
}) {
  return (
    <div className={className}>
      {/* h2, not h3: on /early-bird no title bar precedes this section, so an
          h3 jumped straight from the page h1. */}
      <h2 className="text-center font-script text-[length:var(--text-script-sm)] leading-[var(--leading-heading)] text-ink">
        {title}
      </h2>

      {/* Two up, not four: at four across a wide screen the longest founding
          perk ran to five ragged lines against the shortest one's two. Two
          columns keep every description inside the 50ch measure below.

          Stacked below the standard breakpoint; see COLUMNS_FROM in
          components/layout. Written out rather than interpolated because
          Tailwind only generates classes it can see as literal strings. */}
      <ul className="mt-[var(--spacing-block)] grid gap-x-[var(--spacing-block)] gap-y-[var(--spacing-gutter)] md:grid-cols-2">
        {perks.map((perk) => (
          <li key={perk._key}>
            {/* Pine, not lime: lime on linen is 3.02:1 and fails at this
                size, and lime cannot be darkened enough to pass without
                arriving at pine anyway. Pine is 6.42:1. */}
            <p className="font-sans text-[length:var(--text-ui)] font-medium text-pine">
              {perk.label}
            </p>
            {/* 50ch, not the 68ch of `measure`: a perk is one sentence, and at
                half of this column's width the full measure let the longer ones
                stretch most of the way across the page. Below roughly 1100px
                the cell is already narrower than this and the cap does nothing,
                which is correct — the problem was only ever at the wide end. */}
            <p className="max-w-[50ch] font-serif text-[length:var(--text-body)] text-ink">
              {perk.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The whole founding-membership section, stacked: title band, the pitch and its
 * two buttons, the tier cards in a row, then the two perk lists.
 *
 * One block rather than several because the arrangement is fixed.
 *
 * This replaced a 1:2 split that put the tier cards in a narrow left column
 * beside the pitch and perks. Reading top to bottom — what this is, what to do
 * about it, what it costs, what you get — is the order someone deciding on a
 * membership actually wants, and it is the same order at every width, so the
 * phone layout is the desktop one with fewer columns rather than a different
 * document. The cards also stopped being 360px tall slabs in a column nobody
 * scrolled past.
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
  secondaryCta,
  perksTitle,
  perks,
  memberPerksTitle,
  memberPerks,
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
        className={`container-page ${CONTENT_INSET} ${title ? 'mt-[var(--spacing-block)]' : ''}`}
      >
        {/* The pitch, held to the prose measure and centered. Full width it ran
            to the better part of 900px, which is twice a comfortable line. The
            space-y wrapper is how the rest of the site spaces portable text —
            the renderer emits a flat run of siblings and sets no margins. */}
        <div className="measure mx-auto space-y-[var(--spacing-gutter)] text-center">
          <PortableText
            blocks={intro}
            className="font-serif text-[length:var(--text-lead)] text-ink"
          />

          {/* Wrapped so the two buttons sit side by side and wrap to two
              rows rather than overflowing on a phone. The second is the
              mailing-list opt-in and is optional — a page without one
              renders exactly as it did before. */}
          {cta || secondaryCta ? (
            <p>
              <span className="inline-flex flex-wrap items-center justify-center gap-[var(--spacing-gutter)]">
                {cta ? <CtaLink link={cta} /> : null}
                {secondaryCta ? <CtaLink link={secondaryCta} /> : null}
              </span>
            </p>
          ) : null}
        </div>

        {/* Three across from `lg`, stacked below it, with no two-across step in
            between. Both alternatives were worse:

            - `md:grid-cols-3` (the usual breakpoint here) leaves each card
              about 167px at 768px, and 'three+ kids' in script needs ~171px at
              that width. The name wraps, that card grows taller than the other
              two, and the price rows stop lining up.
            - auto-fit, which the drop-in badges use, puts three tiers into a
              2 + 1 orphan through the whole tablet range. It is the right
              pattern there because the badge count varies; here it is fixed at
              three.

            `lg` is the first width where three names fit outright: ~187px
            needed against ~219px of card. A fourth tier would want auto-fit
            back, or `lg:grid-cols-2 xl:grid-cols-4`.

            items-stretch (the default) so all three cards share a height and
            their buttons sit on one line.

            The wider gap waits for `xl` rather than arriving with the columns
            at `lg`. 1024-1279 is where the cards are narrowest — the container
            is still viewport-bound there, so every pixel of gap comes straight
            out of card width, and 'three+ kids' in script needs about 187px of
            the ~204px a card would have left. From 1280 the container is capped
            at its 1200px maximum and the extra space is free, which leaves the
            cards at ~264px. calc on a token rather than a bare value, the same
            way CONTENT_INSET is built; 1.25 is the one number to move if this
            wants more or less air. */}
        <div className="mt-[var(--spacing-section)] grid gap-[var(--spacing-block)] lg:grid-cols-3 xl:gap-x-[calc(var(--spacing-block)*1.25)]">
          {tiers.map((tier) => (
            <TierCard key={tier._id} tier={tier} />
          ))}
        </div>

        {tiersFootnote ? (
          <p className="measure mx-auto mt-[var(--spacing-gutter)] text-center font-sans text-[length:var(--text-ui)] text-ink-soft">
            {tiersFootnote}
          </p>
        ) : null}

        {/* --spacing-section above the first list, which is the structural break
            between what it costs and what you get; --spacing-block between the
            two lists, which are peers and belong together. */}
        <PerkGroup
          title={perksTitle}
          perks={perks}
          className="mt-[var(--spacing-section)]"
        />

        {memberPerksTitle && memberPerks && memberPerks.length > 0 ? (
          <PerkGroup
            title={memberPerksTitle}
            perks={memberPerks}
            className="mt-[var(--spacing-block)]"
          />
        ) : null}
      </div>
    </section>
  );
}
