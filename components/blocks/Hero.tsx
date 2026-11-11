import type { CSSProperties } from 'react';
import type { BandColor, HeroAfterBand, HeroBlock } from '@/types/content';
import { CtaLink } from '@/components/CtaLink';
import { PortableText } from '@/components/PortableText';
import { Doodle } from '@/components/doodles/Doodle';
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
 * The S-shaped seam between the text column and the photograph.
 *
 * Both paths use clipPathUnits="objectBoundingBox", so every coordinate is a
 * 0–1 fraction of the element and the curve stretches with it. A `clip-path:
 * path()` would have pinned the shape to pixel coordinates and needed a media
 * query per breakpoint. The trade is that the curve scales non-uniformly, which
 * is why both are drawn shallow — a steep curve visibly distorts when the box
 * changes proportion.
 *
 * Which path applies is decided in globals.css by `.hero-seam`: vertical from
 * the md breakpoint, horizontal below it where the two halves stack.
 */
function SeamDefs() {
  return (
    <svg aria-hidden="true" focusable="false" className="pointer-events-none absolute size-0">
      <defs>
        {/* Desktop: the photo's left edge. A shallow S — it bows right to only
            about 0.23 through the top third, crosses near 0.18 and sweeps left
            to 0.06 at the foot. The two arcs stay opposed so it still reads as
            an S rather than one bowed cut, but the top is deliberately close to
            straight; a deeper bow there drew the eye away from the headline.

            The last control point shares the end point's x, so the curve
            arrives travelling straight down. The band below leaves vertical
            too, and two vertical tangents meet without a kink; while this one
            was still drifting left at the foot, the join showed a corner even
            though the two edges touched at the right x. */}
        <clipPath id="hero-seam-vertical" clipPathUnits="objectBoundingBox">
          <path d="M0.22,0 C0.24,0.14 0.23,0.28 0.18,0.44 C0.13,0.60 0.06,0.78 0.06,1 L1,1 L1,0 Z" />
        </clipPath>

        {/* Stacked: the photo's bottom edge, a shallow wave so the linen below
            rises into the picture rather than meeting it on a ruled line. Kept
            low in the box — every percent of height above 1.0 that the curve
            leaves unused is empty space that reads as a gap above the
            headline, not as part of the picture. */}
        <clipPath id="hero-seam-horizontal" clipPathUnits="objectBoundingBox">
          <path d="M0,0 L1,0 L1,0.88 C0.82,0.98 0.63,0.84 0.43,0.95 C0.26,1 0.13,0.95 0,0.99 Z" />
        </clipPath>

        {/* The band below picks the curve up where the one above leaves it.
            Split: exits the photograph at 0.06, the same x its path ends on, so
            the two edges meet exactly.

            The first control point shares the start's x, so the curve leaves
            the join travelling straight down — the direction the hero's path
            now arrives in. Matching tangents, not just matching points, is what
            removes the corner: an earlier pair met at the right x but set off
            at different angles and read as a crease. The mismatch was worse
            than the fractions suggested, because this box is shorter than the
            hero's and the same gradient renders steeper in it.

            From there it rounds out to 0.142 over the full height. An earlier
            attempt arced to 0.19 inside the first third and looked like a
            deliberate notch rather than the tail of the hero's S. */}
        <clipPath id="hero-seam-after-vertical" clipPathUnits="objectBoundingBox">
          <path d="M0.06,0 C0.06,0.20 0.088,0.36 0.105,0.54 C0.122,0.72 0.138,0.88 0.142,1 L1,1 L1,0 Z" />
        </clipPath>

        {/* Stacked: a wave along the band's top edge, mirroring the one the
            photograph above ends on so the two nest instead of meeting flat. */}
        <clipPath id="hero-seam-after-horizontal" clipPathUnits="objectBoundingBox">
          <path d="M0,0.10 C0.18,0.01 0.37,0.15 0.57,0.06 C0.75,-0.02 0.88,0.05 1,0.02 L1,1 L0,1 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

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

      {/* pt clears the absolute site header, which on a phone sits over this
          strip of bare linen — the small white banner the image starts below.
          This is the same token the header sizes itself with, so the strip and
          the bar are always the same height and the wordmark centred in one is
          centred in the other. They used to be two separate values and drifted
          apart. From lg the header floats over the text column instead and no
          padding is needed. */}
      <div className="relative flex min-h-[100dvh] flex-col pt-[var(--spacing-header-compact)] lg:block lg:pt-0">
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

            {/* CONTRAST: provisional. White on mint is 3.13:1. The heading above
                clears it — the script face floors at 28px, so the 3:1 large-text
                bar applies — but this paragraph runs at --text-body and needs
                4.5:1. Kept white at the client's request so the review build
                shows the colour direction as drawn; pine would be 6.66:1. */}
            <PortableText
              blocks={body}
              className="measure mt-[var(--spacing-gutter)] font-serif text-[length:var(--text-body)] text-white"
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
