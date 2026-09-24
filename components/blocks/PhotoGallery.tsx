import type { PhotoGalleryBlock } from '@/types/content';
import { objectPosition } from '@/components/imageFraming';
import { CONTENT_INSET } from '@/components/layout';
import { DecorationLayer } from '@/components/doodles/DecorationLayer';

/** Stacked below the standard breakpoint; see COLUMNS_FROM in components/layout. */
const GRID: Record<Exclude<PhotoGalleryBlock['layout'], 'single'>, string> = {
  grid: 'grid gap-[var(--spacing-block)] md:grid-cols-3',
  strip: 'grid gap-[var(--spacing-block)] md:grid-cols-4',
  featured: 'grid gap-[var(--spacing-block)] md:grid-cols-2',
};

/**
 * Authored photography.
 *
 * Held to the same inset as the membership and location sections, so a
 * full-width render lines up with the rest of the page rather than running
 * closer to the viewport edge than anything around it.
 *
 * 'single' is one image at its own proportions — it is a standalone render,
 * and cropping it to a fixed ratio like ImageTextSplit does would cut the
 * floor plan it exists to show. Every other layout crops to a shared 4:3 so a
 * row of mismatched sources still lines up.
 */
export function PhotoGallery({
  images,
  layout,
  heading,
  caption,
  decorations,
  anchorId,
}: PhotoGalleryBlock) {
  if (images.length === 0) return null;

  const single = layout === 'single';

  return (
    <section
      id={anchorId}
      data-reveal
      className={`container-page ${CONTENT_INSET} relative my-[var(--spacing-section)]`}
    >
      <DecorationLayer decorations={decorations} />
      {heading ? (
        <h2 className="mb-[var(--spacing-block)] text-center font-script text-[length:var(--text-script-sm)] leading-[var(--leading-heading)] text-ink">
          {heading}
        </h2>
      ) : null}

      <div className={single ? '' : GRID[layout]}>
        {(single ? images.slice(0, 1) : images).map((image) => (
          <img
            key={image.url}
            src={image.url}
            alt={image.alt}
            width={image.width}
            height={image.height}
            style={{ objectPosition: objectPosition(image) }}
            className={
              single
                ? 'w-full'
                : 'aspect-[4/3] w-full object-cover'
            }
          />
        ))}
      </div>

      {caption ? (
        <p className="mt-[var(--spacing-gutter)] text-center font-sans text-[length:var(--text-ui)] text-ink-soft">
          {caption}
        </p>
      ) : null}
    </section>
  );
}
