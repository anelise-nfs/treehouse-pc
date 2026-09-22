import type { LocationBlock } from '@/types/content';
import { CONTENT_INSET } from '@/components/layout';

/**
 * Google Maps directions, built by encoding the authored address rather than
 * storing a short-link, so it keeps working if the address ever changes.
 */
function directionsUrl(address: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

/**
 * The map.
 *
 * PHASE 2 — the visual inside `MapVisual` below is the only part that changes.
 * The props (`location.address`, `location.coordinates`, `zoom`) are already the
 * inputs a real map needs, so swapping the renderer is not a schema change:
 *
 *   now      this branded placeholder card
 *   next     a Mapbox Static Images URL built from coordinates + zoom, as an
 *            <img> — still no runtime map dependency, still one request
 *   later    interactive Mapbox GL, if panning is ever wanted
 *
 * Mapbox over the Google Embed deliberately: Google's embed cannot be
 * brand-styled, and it forces a keyed, billed embed to load on every pageview.
 * A static image with a muted Treehouse style keeps the page free of any
 * runtime map dependency. Launch needs a Mapbox account on the client's own
 * free tier.
 *
 * `zoom` is intentionally unread here — the placeholder has nothing to zoom.
 * It stays in the props so the Mapbox swap needs no content change.
 */
export function LocationMap({ location, anchorId }: LocationBlock) {
  return (
    <section id={anchorId} className={`container-page ${CONTENT_INSET} my-[var(--spacing-section)]`}>
      <a
        href={directionsUrl(location.address)}
        target="_blank"
        rel="noopener noreferrer"
        className="block no-underline"
      >
        {/* label is rendered verbatim; address drives the link, not the display. */}
        <MapVisual label={location.label} />
      </a>
    </section>
  );
}

/**
 * THE SWAP POINT. Replace this body with the Mapbox <img> and nothing outside
 * this function needs to change.
 *
 * All three text colors here are ink or ink-soft on seafoam — 11.72:1 and
 * 5.99:1, both clear AA. The pin is decorative and labelled by the text below.
 */
function MapVisual({ label }: { label: string }) {
  return (
    <div className="flex aspect-[4/3] flex-col items-center justify-center gap-[var(--spacing-gutter)] rounded-[var(--radius-card)] bg-seafoam px-[var(--spacing-gutter)] text-center md:aspect-[2/1]">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-10 fill-none stroke-pine"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 21s7-5.686 7-11a7 7 0 1 0-14 0c0 5.314 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.75" />
      </svg>

      <p className="font-sans text-[length:var(--text-lead)] font-semibold text-ink">{label}</p>

      <p className="font-sans text-[length:var(--text-ui)] text-ink-soft underline">
        View on Google Maps
      </p>
    </div>
  );
}
