import type { HoursAddressBlock, PostalAddress } from '@/types/content';
import { CONTENT_INSET } from '@/components/layout';

/** 'Park City, UT 84098' — the second line of a US postal address. */
function localityLine(address: PostalAddress): string {
  return `${address.city}, ${address.region} ${address.postalCode}`;
}

/**
 * Opening hours beside the postal address.
 *
 * `location` is resolved from SiteSettings by /lib/content.ts rather than
 * authored on the block, so hours and address have one home — they also appear
 * in the footer and change often. Renders nothing at all if it is absent, which
 * is the state a page gets before that resolution runs.
 *
 * Script labels are ink on linen at 16.78:1 and the lines beneath are ink-soft
 * at 8.58:1. Both clear AA.
 */
export function HoursAddress({ location, anchorId }: HoursAddressBlock) {
  if (!location) return null;

  const { address, hours } = location;

  return (
    <section id={anchorId} className={`container-page ${CONTENT_INSET} my-[var(--spacing-section)]`}>
      <div className="grid gap-[var(--spacing-section)] text-center sm:grid-cols-2">
        {hours && hours.length > 0 ? (
          <div>
            <h2 className="font-script text-[length:var(--text-script-sm)] leading-[var(--leading-heading)] text-ink">
              hours
            </h2>
            {hours.map((entry) => (
              <p
                key={entry._key}
                className="font-sans text-[length:var(--text-lead)] text-ink-soft"
              >
                {entry.days}
                <span className="block">{entry.hours}</span>
              </p>
            ))}
          </div>
        ) : null}

        <div>
          <h2 className="font-script text-[length:var(--text-script-sm)] leading-[var(--leading-heading)] text-ink">
            address
          </h2>
          <p className="font-sans text-[length:var(--text-lead)] text-ink-soft">
            {address.street}
            {address.street2 ? <span className="block">{address.street2}</span> : null}
            <span className="block">{localityLine(address)}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
