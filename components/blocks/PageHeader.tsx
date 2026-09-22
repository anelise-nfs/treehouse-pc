import type { PageHeaderBlock, PageHeaderHeight } from '@/types/content';

const HEIGHTS: Record<PageHeaderHeight, string> = {
  small: 'h-[clamp(140px,18vw,200px)]',
  medium: 'h-[clamp(220px,30vw,380px)]',
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
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.55),transparent_70%)]"
      />

      {/* Padded down by the full header height so the title is placed relative to
          the bottom of the site header rather than the top of the image. At the
          small height's 140px floor this is what keeps the title off the logo. */}
      <div className="absolute inset-0 flex items-center justify-center px-[var(--spacing-gutter)] pb-[clamp(0.5rem,2vw,1.5rem)] pt-[var(--spacing-header)]">
        <h1 className="text-center font-sans text-[length:var(--text-h2)] font-semibold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
          {title}
        </h1>
      </div>
    </section>
  );
}
