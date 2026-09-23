import type { PhotoGalleryBlock } from '@/types/content';
import { objectPosition } from '@/components/imageFraming';

/** Stacked below the standard breakpoint; see COLUMNS_FROM in components/layout. */
const GRID: Record<Exclude<PhotoGalleryBlock['layout'], 'single'>, string> = {
  grid: 'grid gap-[var(--spacing-block)] md:grid-cols-3',
  strip: 'grid gap-[var(--spacing-block)] md:grid-cols-4',
  featured: 'grid gap-[var(--spacing-block)] md:grid-cols-2',
};

/**
 * Authored photography.
 *
 * 'single' is one image at its own proportions — it is a standalone render,
 * and cropping it to a fixed ratio like ImageTextSplit does would cut the
 * floor plan it exists to show. Every other layout crops to a shared 4:3 so a
 * row of mismatched sources still lines up.
 */
export function PhotoGallery({ images, layout, heading, caption, anchorId }: PhotoGalleryBlock) {
  if (images.length === 0) return null;

  const single = layout === 'single';

  return (
    <section id={anchorId} className="container-page my-[var(--spacing-section)]">
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
