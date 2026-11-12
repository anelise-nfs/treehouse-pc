import type { CSSProperties } from 'react';
import type { BandColor, HeroAfterBand, HeroBlock } from '@/types/content';
import { CtaLink } from '@/components/CtaLink';
import { PortableText } from '@/components/PortableText';
import { Doodle } from '@/components/doodles/Doodle';
import { DecorationLayer } from '@/components/doodles/DecorationLayer';
import { SeamDefs } from './SeamDefs';

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
 * Decorative marks that drift along the seam.
 *
 * Fixed in the component rather than exposed as `decorations`: they are
 * positioned against the curve, so an author moving them would only break the
 * relationship. The block's own `decorations` still render underneath and stay
 * author-controlled.
 *
 * Each gets its own duration and tilt through custom properties so the three
 * never beat in sync, which is what makes idle motion read as mechanical.
 *
 * All three are desktop-only. In the stacked layout there is no linen margin
 * for them to sit in, so they landed on the photograph and on the wordmark —
 * busy, and exactly what they are there to avoid.
 */
const FLOATERS = [
  // All three sit on the linen side. Marks over the photograph competed with
  // the picture and read as dirt on the lens rather than decoration. Their x
  // positions are tied to where the seam actually falls, so widening the media
  // box moves them: the curve sweeps left as it descends, and the lower a mark
  // sits the less linen there is to its right.
  { name: '3stars', color: 'sunshine', motion: 'hero-float', at: 'left-[36%] top-[7%] w-20', duration: '7.5s', tilt: '-10deg' },
  { name: 'leaf', color: 'lime', motion: 'hero-float', at: 'left-[38%] top-[31%] w-10', duration: '11s', tilt: '18deg' },
  { name: 'vertscribble', color: 'flamingo', motion: 'hero-scribble', at: 'left-[7%] bottom-[6%] w-12', duration: '6.5s', tilt: '6deg' },
] as const;

/**
 * Homepage opener: a linen text column and a photograph, split by an S-curve.
 *
 * The photograph is absolutely positioned from md up so the text column can be
 * a normal flex child and centre itself vertically without the two needing to
 * agree on a height. Below md they stack, the image taking the full width with
 * the seam running along its bottom edge.
 *
 * All text sits on linen as ink — 16.78:1 — so nothing here is size-constrained
 * the way white-on-a-brand-fill would be. The photograph carries no text at all,
 * which is what makes this safe when the image becomes author-selectable in
 * Phase 2: no crop can introduce a contrast failure.
 */
export function Hero({
  image,
  scriptHeadline,
  mobileScriptHeadline,
  overlayHeadline,
  primaryCta,
  bandColor,
  afterBand,
  decorations,
  anchorId,
}: HeroBlock) {
  return (
    <>
    <section id={anchorId} className="relative isolate overflow-hidden bg-surface">
      <SeamDefs />

      {/* No padding to clear the header below lg: the header is sticky and in
          flow there, so it takes its own height above this block and the
          photograph starts directly beneath it. This used to be a reserved
          strip of bare linen with an absolute bar floating over it — the same
          cream band to look at, but belonging to the hero rather than to the
          header. Keeping the padding as well would have shown both.

          The viewport height has to lose that band for the same reason, or the
          hero plus the bar above it runs past the fold by exactly the bar's
          height. From lg the header is an overlay again, takes no space, and
          the hero is a full 100dvh. */}
      <div className="relative flex min-h-[calc(100dvh-var(--spacing-header-compact))] flex-col lg:block lg:min-h-[100dvh]">
        {/* MEDIA */}
        <div className="hero-media-scroll relative z-10 h-[52vh] min-h-[260px] w-full shrink-0 [--hero-media-w:60%] [--hero-media-w-end:70%] [--hero-media-w-full:125%] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:min-h-0 lg:w-[var(--hero-media-w)] xl:[--hero-media-w:68%] xl:[--hero-media-w-end:78%] 2xl:[--hero-media-w:72%] 2xl:[--hero-media-w-end:82%]">
          {/* A second copy of the shape, offset behind the photo, so the seam
              reads as a brand-coloured edge rather than a cut. */}
          <div
            aria-hidden="true"
            className={`hero-seam pointer-events-none absolute inset-0 translate-y-2 lg:-translate-x-3 lg:translate-y-0 ${BAND_BG[bandColor]}`}
          />

          <div className="hero-seam absolute inset-0">
            <img
              src={image.url}
              alt={image.alt}
              className="hero-drift size-full object-cover"
            />
          </div>
        </div>

        {/* TEXT — the column carries no z-index of its own, so the headings
            below sit under the photograph as it expands over them. The column
            is positioned but not stacked, which lets the button inside it take
            a z-index that still competes with the photograph's: headings
            behind, button and floaters in front.

            Top-aligned while stacked, centred once the columns split.
            Centring it in the stacked layout left the headline floating in the
            middle of the leftover height: 94px below the picture at 390 and
            211px at 1023, which read as a hole rather than as spacing.

            The column is narrower than the linen area it sits in, which
            is deliberate: the photograph is absolutely positioned, so this
            width sets the measure and the white space to its right without
            touching the image ratio. The two steps keep the tagline on three
            lines across the desktop range: at a flat 40% it ran to four once
            the viewport dropped near 1024, where the column is narrow but the
            headline has barely shrunk.

            The left padding is the page gutter plus the wordmark's own
            indent (the trigger's 2.75rem, plus the header's 1.25rem gap, less
            its -0.5rem margin), so the h1, h2 and button share a left edge with
            the logo above them and the four read as one stack. Change the
            header's gap or trigger size and this has to follow. */}
        <div className="relative flex flex-1 flex-col justify-start px-[var(--spacing-gutter)] text-right lg:justify-center lg:text-left pb-[var(--spacing-section)] pt-[var(--spacing-block)] lg:min-h-[100dvh] lg:w-[44%] lg:py-0 xl:w-[40%] xl:max-w-[36rem] lg:pl-[calc(var(--spacing-gutter)+var(--tap-target)+0.75rem)]">
          {/* CONTRAST: mint on linen is 3.01:1. --text-hero-title floors at 30px
              so this always counts as large text and 3:1 applies — but it clears
              it by 0.01, with no real margin. Dropping this under 24px, or
              lightening linen, fails it immediately. A deeper green is the fix
              if that margin is ever wanted; pine is 6.42:1. */}
          {/* The scale lives on this wrapper, not on the column. A transform
              creates a stacking context, and on the column it trapped the
              button's z-index inside it — the photograph then painted over the
              button as well as the headings. Scoped here, the headings get
              their own context that sits under the photograph while the button
              outside it keeps competing on the section's own stacking order. */}
          <div className="hero-text-scroll">
          <h1 className="hero-rise hero-rise-1 font-sans text-hero-title font-bold leading-[var(--leading-display)] text-mint lg:text-split-title">
            {/* A shorter string on phones. This was a hard constraint while the
                line was set in the script face, which could not shrink below
                28px; in Quicksand it is now a copy choice and could be dropped
                if the full line reads well on a phone. */}
            {mobileScriptHeadline ? (
              <>
                <span className="lg:hidden">{mobileScriptHeadline}</span>
                <span className="hidden lg:inline">{scriptHeadline}</span>
              </>
            ) : (
              scriptHeadline
            )}
          </h1>

          {/* Explicit margins rather than a flex gap on the column: the gap was
              uniform, and the h1 wants to sit nearer its h2 than the button
              does to either. */}
          <h2 className="hero-rise hero-rise-2 measure ml-auto mt-[var(--spacing-gutter)] lg:ml-0 font-serif text-[length:var(--text-h3)] leading-[1.4] text-ink">
            {overlayHeadline}
          </h2>
          </div>

          <p className="hero-rise hero-rise-3 relative z-20 mt-[var(--spacing-block)]">
            <CtaLink link={primaryCta} />
          </p>
        </div>

        {FLOATERS.map((floater) => (
          <Doodle
            key={`${floater.name}-${floater.at}`}
            name={floater.name}
            color={floater.color}
            className={`${floater.motion} pointer-events-none absolute z-30 hidden lg:block ${floater.at}`}
            style={{
              '--hero-float-duration': floater.duration,
              '--hero-float-tilt': floater.tilt,
            } as CSSProperties}
          />
        ))}
      </div>

      <DecorationLayer decorations={decorations} />
    </section>

      {afterBand ? <AfterBand {...afterBand} /> : null}
    </>
  );
}

/**
 * The band directly below the hero.
 *
 * Lives here, not in its own file, because it is not independent: its seam
 * starts on the exact x the hero's path ends on, its panel reads the same
 * --hero-media-w variables, and it carries the same scroll animation off the
 * same timeline. Those three have to move together or the join opens up, and
 * the surest way to keep them together is to keep them in one file.
 */
function AfterBand({ heading, body, cta, image, color = 'mint' }: HeroAfterBand) {
  return (
    // clip-path, not overflow-hidden: the panel lifts above this section's box
    // while stacked, and overflow-hidden cut it off at the seam. Clipping the
    // sides only still contains the full-bleed width it grows to on desktop,
    // which is what the hidden overflow was there for.
    <section className="relative isolate bg-surface [clip-path:inset(-100vh_0_0_0)]">
      <div className="relative flex flex-col lg:block lg:min-h-[62vh]">
        {/* COLOUR PANEL — the same width variables and scroll class as the
            hero's photograph, so the two edges stay aligned at every scroll
            position rather than only at rest.

            Plus 0.75rem. The hero's painted left edge is not the photograph's
            but the mint echo behind it, which sits 12px further left, and
            matching the photograph left a 12px step at the join. Widening the
            panel by the echo's offset puts its edge on the same line; it is
            added to the width rather than translated so the panel still reaches
            the right edge of the viewport. */}
        <div
          className={`hero-media-scroll hero-seam-after hero-band-rise relative order-2 w-full [--hero-media-w:calc(60%_+_0.75rem)] [--hero-media-w-end:calc(70%_+_0.75rem)] [--hero-media-w-full:calc(125%_+_0.75rem)] lg:absolute lg:inset-y-0 lg:right-0 lg:order-none lg:w-[var(--hero-media-w)] xl:[--hero-media-w:calc(68%_+_0.75rem)] xl:[--hero-media-w-end:calc(78%_+_0.75rem)] 2xl:[--hero-media-w:calc(72%_+_0.75rem)] 2xl:[--hero-media-w-end:calc(82%_+_0.75rem)] ${BAND_BG[color]}`}
        >
          {/* Anchored to the panel's right edge, not inset from its left. The
              inset was a percentage of the panel, so when the panel grows past
              the viewport in the second phase the text slid left with it and
              off the screen. The right edge is the one thing that does not move
              — the panel is right-anchored, so its right edge is the viewport's
              — and a width in vw is likewise independent of the panel. Between
              them the copy holds still while the colour sweeps out behind it.
              56.5vw puts its left edge at 43.5vw, where the old percentage
              inset had it. The 5vw right padding pairs with the ring's 5.75vw
              left padding so the two sit inside matching outer margins and the
              pair reads as centred. The two numbers differ because this is a
              box edge while the ring's is the graphic itself: the headline does
              not fill its column, so the visible gap on the right runs a little
              wider than the padding. At very wide viewports that gap grows,
              since the headline's length is fixed while the column is not.

              Stacked, there is no seam to clear horizontally, so it runs full
              width with top padding for the wave instead. */}
          <div className="hero-band-text flex h-full flex-col justify-center px-[var(--spacing-gutter)] pb-[var(--spacing-block)] pt-[calc(var(--spacing-block)+8vw)] lg:ml-auto lg:w-[56.5vw] lg:px-0 lg:pr-[5vw] lg:py-0">
            <h2 className="font-script text-[length:var(--text-script-sm)] leading-[var(--leading-heading)] text-white">
              {heading}
            </h2>

            {/* Ink, not white, and the only text on this band that is. White on
                mint is 3.13:1: fine for the heading above, which is large text
                and has only a 3:1 bar, but this paragraph runs at --text-body
                and needs 4.5:1. Ink on the same mint is 5.57:1 and passes at
                any size, so the background colour is untouched.

                Two alternatives were tried and rejected. Holding white and
                raising this to 24px passes as large text, but by 0.13, and 54
                words at that size fills a phone screen. Darkening mint until
                white clears 4.5:1 lands near #3f8367 — close enough to pine to
                not be mint any more, and it would drop ink on mint to 3.86:1,
                breaking the 'party with us' band and the mint price badges,
                which rely on --color-on-mint being ink. No shade satisfies
                both: white needs luminance <= 0.183, ink needs >= 0.233.

                An earlier note here offered pine at 6.66:1 as the fix. That is
                white-on-pine, a different pairing; pine text on mint is
                2.13:1, worse than the white it was meant to replace. */}
            <PortableText
              blocks={body}
              className="measure mt-[var(--spacing-gutter)] font-serif text-[length:var(--text-body)] text-ink"
            />

            {cta ? (
              <p className="mt-[var(--spacing-block)]">
                <CtaLink link={cta} />
              </p>
            ) : null}
          </div>
        </div>

        {/* GRAPHIC — the top padding is load-bearing while stacked: it pushes
            both the ring and the colour behind it clear of the hero's button,
            and it is what creates the window the lift aims into. Shrink it and
            the colour rises into the button; grow it and the colour stops
            short of the ring.

            Decorative, so empty alt and hidden from assistive tech:
            the heading beside it carries the meaning.

            relative z-10 is load-bearing: the panel is absolutely positioned
            and would otherwise paint over this once it goes full bleed. The
            ring has to sit in front of the colour, not under it. */}
        <div className="relative z-10 order-1 flex items-center justify-center px-[var(--spacing-gutter)] pb-2 pt-6 lg:order-none lg:py-0 lg:min-h-[62vh] lg:w-[38%] lg:justify-start lg:py-0 lg:pl-[5.75vw]">
          <img
            src={image.url}
            alt=""
            aria-hidden="true"
            className="hero-float block w-40 lg:w-full lg:max-w-[17rem]"
            style={{ '--hero-float-duration': '13s', '--hero-float-tilt': '0deg' } as CSSProperties}
          />
        </div>
      </div>
    </section>
  );
}
