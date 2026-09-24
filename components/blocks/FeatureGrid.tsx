import type { FeatureGridBlock } from '@/types/content';
import { objectPosition } from '@/components/imageFraming';
import { DecorationLayer } from '@/components/doodles/DecorationLayer';

/** Stacked below the standard breakpoint; see COLUMNS_FROM in components/layout. */
const COLUMNS: Record<FeatureGridBlock['columns'], string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-2 lg:grid-cols-4',
};

/**
 * A row of image cards — the party rooms.
 *
 * The block carries its own heading rather than leaning on a separate band
 * above it, because the heading names this grid rather than the page section.
 *
 * Cards crop to a fixed 4:3 like ImageTextSplit, for the same reason: source
 * photography arrives at mismatched dimensions and letting each image set its
 * own height leaves the row visibly uneven.
 */
export function FeatureGrid({ heading, subheading, items, columns, decorations, anchorId }: FeatureGridBlock) {
  return (
    <section id={anchorId} className="container-page relative my-[var(--spacing-section)]">
      <DecorationLayer decorations={decorations} />
      {/* Ink on linen throughout this block, 16.78:1 for the script and 8.58:1
          for the muted captions. Both clear AA. */}
      <h2 className="text-center font-script text-[length:var(--text-script-sm)] leading-[var(--leading-heading)] text-ink">
        {heading}
      </h2>

      {subheading ? (
        <p className="mt-[var(--spacing-gutter)] text-center font-sans text-[length:var(--text-ui)] text-ink-soft">
          {subheading}
        </p>
      ) : null}

      <div
        className={`mt-[var(--spacing-block)] grid items-start gap-[var(--spacing-block)] ${COLUMNS[columns]}`}
      >
        {items.map((item) => (
          <div key={item._key}>
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={item.image.url}
                alt={item.image.alt}
                width={item.image.width}
                height={item.image.height}
                style={{ objectPosition: objectPosition(item.image) }}
                className="size-full object-cover"
              />
            </div>

            <h3 className="mt-[var(--spacing-gutter)] text-center font-script text-[length:var(--text-script-sm)] leading-[var(--leading-heading)] text-ink">
              {item.title}
            </h3>

            {item.caption ? (
              <p className="text-center font-sans text-[length:var(--text-ui)] text-ink-soft">
                {item.caption}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
