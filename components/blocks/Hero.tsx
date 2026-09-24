import type { BandColor, HeroBlock } from '@/types/content';
import { CtaLink } from '@/components/CtaLink';
import { PortableText } from '@/components/PortableText';
import { DecorationLayer } from '@/components/doodles/DecorationLayer';

const BAND_BG: Record<BandColor, string> = {
  pine: 'bg-pine',
  mint: 'bg-mint',
  tangerine: 'bg-tangerine',
  flamingo: 'bg-flamingo',
  seafoam: 'bg-seafoam',
  sunshine: 'bg-sunshine',
  lime: 'bg-lime',
  tomato: 'bg-tomato',
  sky: 'bg-sky',
  ocean: 'bg-ocean',
};

/**
 * Homepage opener.
 *
 * The script band straddles the seam between the image and the linen section:
 * it is anchored to the bottom of the image and pushed down half its own height,
 * so the linen section below carries extra top padding to clear the overhang.
 *
 * The two gradients and the text-shadow are fixed, not author options. The image
 * underneath becomes author-selectable in Phase 2 and the overlay text has to
 * stay legible over whatever gets chosen.
 */
export function Hero({
  image,
  overlayHeadline,
  overlayCta,
  scriptHeadline,
  mobileScriptHeadline,
  bandColor,
  subhead,
  primaryCta,
  decorations,
  anchorId,
}: HeroBlock) {
  return (
    <section id={anchorId} className="relative overflow-hidden">
      <DecorationLayer decorations={decorations} />
      {/* bg-ink-soft keeps white overlay text legible before the image paints. */}
      <div className="relative h-[70vh] min-h-[420px] bg-ink-soft md:h-[90vh]">
        <img
          src={image.url}
          alt={image.alt}
          className="absolute inset-0 size-full object-cover"
        />

        <div className="absolute inset-x-0 bottom-[22%] px-[var(--spacing-gutter)] text-center md:left-auto md:right-0 md:w-[55%] md:pr-[max(var(--spacing-gutter),3rem)] md:text-right">
          {/* Contained scrim, anchored to the text rather than spanning the image.
              A full-frame wash strong enough for a bright photo would darken the
              play structure, which is the selling image. This puts 58% black
              exactly where the words are: solid across the text box, then a
              60px spread and 100px blur carry it to transparent within ~120px
              of the text edges. Measured: 55% behind text is 4.74:1 even against
              pure white, and 7.9:1 against the pale wood that currently fails at
              2.07:1. The text-shadow below is a third layer on top of this. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[rgba(0,0,0,0.58)] shadow-[0_0_100px_60px_rgba(0,0,0,0.58)]"
          />

          <h1 className="relative font-sans text-[length:var(--text-hero)] font-semibold leading-[var(--leading-heading)] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
            {overlayHeadline}
          </h1>

          {overlayCta ? (
            <p className="relative mt-[var(--spacing-block)]">
              <CtaLink link={overlayCta} />
            </p>
          ) : null}
        </div>

        {/* Straddles the image's bottom edge: half over the photo, half onto linen. */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-1/2 justify-center px-[var(--spacing-gutter)]">
          <p
            // The padding is deliberately lopsided: 0.1em is moved from the top
            // to the bottom so the script sits slightly high in the band. Its ink
            // is already centred to within 0.02px, but the descenders (g, p, y)
            // read as weight below the word and make it look low. Expressed in em
            // so it scales with --text-band instead of drifting at one size.
            //
            // The full headline runs at every width — no shortened mobile
            // variant. The script face floors at 28px, where the string is 553px,
            // so on a phone it has to wrap; the widest of its two lines
            // ('climb higher, imagine') needs 301px, which is why the inner
            // padding drops to 12px on phones — the band keeps the page's gutter
            // rather than sitting closer to the screen edge than everything else.
            // Looser leading keeps the wrap readable.
            className={`${BAND_BG[bandColor]} max-w-full rounded-[var(--radius-card)] px-3 sm:px-[clamp(1.5rem,4vw,3rem)] pt-[calc(clamp(0.875rem,1.5vw,1rem)-0.1em)] pb-[calc(clamp(0.875rem,1.5vw,1rem)+0.1em)] text-center font-script text-[length:var(--text-band)] leading-[1.35] text-white sm:max-w-full sm:leading-[var(--leading-heading)]`}
          >
            {/* CONTRAST: provisional, and a fail at any size. White on mint is
                2.15:1 — it does not even clear the 3:1 large-display bar that
                the previous ocean band (3.56:1) scraped past. Set to mint at the
                client's request so the review build shows their color direction
                as drawn; resolve in the pre-launch pass. */}
            {mobileScriptHeadline ? (
              <>
                <span className="md:hidden">{mobileScriptHeadline}</span>
                <span className="hidden md:inline">{scriptHeadline}</span>
              </>
            ) : (
              scriptHeadline
            )}
          </p>
        </div>
      </div>

      {/* Top padding clears the half-band hanging into this section. */}
      <div className="bg-surface px-[var(--spacing-gutter)] pb-[var(--spacing-section)] pt-[calc(var(--spacing-block)+3.5rem)] text-center">
        <PortableText
          blocks={subhead}
          // Not the shared 68ch `measure`, which is sized for running body copy
          // and leaves this short subhead as one long desktop line. The px is a
          // second gutter for phones, where the max-width never binds.
          className="mx-auto max-w-[46ch] px-[var(--spacing-gutter)] font-serif text-[length:var(--text-h3)] text-ink"
        />
        <p className="mt-[var(--spacing-block)]">
          <CtaLink link={primaryCta} />
        </p>
      </div>
    </section>
  );
}
