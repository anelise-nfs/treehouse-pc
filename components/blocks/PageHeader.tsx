import type { BandColor, PageHeaderBlock, PageHeaderHeight } from '@/types/content';

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
 * Sized so the photograph reads as a header image rather than a strip. `small`
 * lands around half the homepage hero's height; `medium` keeps the same
 * relationship to it that it always had.
 *
 * The old values also put the title on top of the site header overlaying it —
 * at 390px the h1 started 18px above the header's bottom edge, because the bar
 * grew past --spacing-header when the wordmark was enlarged.
 */
const HEIGHTS: Record<PageHeaderHeight, string> = {
  small: 'h-[clamp(280px,32vw,440px)]',
  medium: 'h-[clamp(420px,50vw,660px)]',
};

/**
 * Sub-page opener: the page's h1 in a color block straddling the bottom edge of
 * a photograph, the same device the homepage hero uses for its script band.
 *
 * The title sat directly on the photo until it moved into this band. White on a
 * picture cannot be made reliably compliant — the backdrop varies per pixel, and
 * 36% of the glyph area measured under 4.5:1 with a worst case of 1.88:1. On a
 * solid fill it is a fixed, checkable number, and it stays correct when the
 * image becomes author-selectable in Phase 2.
 *
 * Sans, not the script face the homepage band uses: this is the page's h1 and
 * holds to the heading face.
 *
 * The image is decorative — the title carries the meaning — so it takes empty
 * alt and is hidden from assistive tech.
 */
export function PageHeader({
  title,
  image,
  height,
  bandColor = 'mint',
  anchorId,
}: PageHeaderBlock) {
  /* Favour the top of the image. These renders are darkest at the ceiling, and
     a short crop taken from the vertical centre puts the header's wordmark over
     the brightest, busiest band of the photo. An authored hotspot wins. */
  const objectPosition = image.hotspot
    ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`
    : '50% 15%';

  return (
    /* The band hangs half its height below the image, so the section carries a
       matching bottom margin and the block beneath it starts clear of the
       overhang rather than having to know about it. */
    <section id={anchorId} className="relative mb-[clamp(1.75rem,3.5vw,2.75rem)]">
      <div className={`relative ${HEIGHTS[height]} bg-ink-soft`}>
        <img
          src={image.url}
          alt=""
          aria-hidden="true"
          style={{ objectPosition }}
          className="absolute inset-0 size-full object-cover"
        />

        {/* Kept as a vignette that settles the photo into the band below it.
            It no longer carries any contrast duty. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.68),transparent_72%)]"
        />
      </div>

      {/* Straddles the image's bottom edge: half over the photo, half below. */}
      <div className="absolute inset-x-0 bottom-0 flex translate-y-1/2 justify-center px-[var(--spacing-gutter)]">
        <h1
          className={`${BAND_BG[bandColor]} max-w-full rounded-[var(--radius-card)] px-3 sm:px-[clamp(1.5rem,4vw,3rem)] py-[clamp(0.875rem,1.5vw,1rem)] text-center font-sans text-[length:var(--text-display)] font-semibold leading-[var(--leading-display)] text-white`}
        >
          {title}
        </h1>
      </div>
    </section>
  );
}
