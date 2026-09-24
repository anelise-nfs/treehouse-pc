import type { PageHeaderBlock, PageHeaderHeight } from '@/types/content';

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
 * Sub-page opener: the page's h1 over a photograph, with the site header
 * overlaying it exactly as it does the homepage hero.
 *
 * The image is decorative — the title carries the meaning — so it takes empty
 * alt and is hidden from assistive tech. The scrim and text-shadow are fixed for
 * the same reason as the hero's: the image is author-selectable in Phase 2.
 */
export function PageHeader({ title, image, height, anchorId }: PageHeaderBlock) {
  /* Favour the top of the image. These renders are darkest at the ceiling, and
     a short crop taken from the vertical centre puts the header's wordmark over
     the brightest, busiest band of the photo. An authored hotspot wins. */
  const objectPosition = image.hotspot
    ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`
    : '50% 15%';

  return (
    <section
      id={anchorId}
      className={`relative ${HEIGHTS[height]} bg-ink-soft`}
    >
      <img
        src={image.url}
        alt=""
        aria-hidden="true"
        style={{ objectPosition }}
        className="absolute inset-0 size-full object-cover"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.68),transparent_72%)]"
      />

      {/* Padded down by the full header height so the title is placed relative to
          the bottom of the site header rather than the top of the image. At the
          small height's 140px floor this is what keeps the title off the logo. */}
      <div className="absolute inset-0 flex items-center justify-center px-[var(--spacing-gutter)] pb-[clamp(0.5rem,2vw,1.5rem)] pt-[var(--spacing-header)]">
        <h1 className="text-center font-sans text-[length:var(--text-display)] font-semibold leading-[var(--leading-display)] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
          {title}
        </h1>
      </div>
    </section>
  );
}
