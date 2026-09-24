import type { PartyPackagesBlock } from '@/types/content';
import { CtaLink } from '@/components/CtaLink';
import { PortableText } from '@/components/PortableText';
import { DecorationLayer } from '@/components/doodles/DecorationLayer';

/**
 * Named party options side by side.
 *
 * Column count follows the array rather than being authored, so a third package
 * in Phase 2 flows in without a layout change. Columns are top-aligned: the
 * descriptions differ in length and stretching them to match would put ragged
 * whitespace under the shorter one.
 */
export function PartyPackages({
  heading,
  intro,
  packages,
  link,
  decorations,
  anchorId,
}: PartyPackagesBlock) {
  const columns = packages.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2';

  return (
    <section id={anchorId} data-reveal
      className="container-page relative my-[var(--spacing-section)]">
      <DecorationLayer decorations={decorations} />
      {heading ? (
        <h2 className="text-center font-script text-[length:var(--text-script-sm)] leading-[var(--leading-heading)] text-ink">
          {heading}
        </h2>
      ) : null}

      <PortableText
        blocks={intro}
        className="measure mx-auto text-center font-sans text-[length:var(--text-ui)] text-ink-soft"
      />

      <div className={`grid items-start gap-[var(--spacing-section)] ${columns}`}>
        {packages.map((pkg) => (
          <div key={pkg._id} className="text-center">
            {/* Ink on linen, 16.78:1 — the script titles pass AA comfortably. */}
            <h3 className="font-script text-[length:var(--text-script-sm)] leading-[var(--leading-heading)] text-ink">
              {pkg.name}
            </h3>

            <p className="mt-[var(--spacing-gutter)] font-sans text-[length:var(--text-lead)] text-ink">
              {pkg.priceLine}
            </p>

            <div className="mt-[var(--spacing-block)] space-y-[var(--spacing-gutter)]">
              <PortableText
                blocks={pkg.description}
                className="font-serif text-[length:var(--text-body)] text-ink"
              />
            </div>
          </div>
        ))}
      </div>

      {link ? (
        <p className="mt-[var(--spacing-section)] text-center">
          <CtaLink link={link} />
        </p>
      ) : null}
    </section>
  );
}
