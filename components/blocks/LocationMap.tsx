import type { LocationBlock } from '@/types/content';
import { CONTENT_INSET } from '@/components/layout';
import { DecorationLayer } from '@/components/doodles/DecorationLayer';
import { hasMapKey, staticMapUrl } from '@/lib/map';

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
 * A real map when a Google Maps Static API key is configured, and the branded
 * placeholder when it is not — so the build, the dev server and the review
 * site all work with no key present, and the key arriving is a deploy setting
 * rather than a code change. See lib/map.ts.
 *
 * Google Static over Google Embed: an iframe cannot carry our own pin, and it
 * swallows clicks, so the card could no longer link out to directions. Both
 * are things this block already did as a placeholder and should not lose by
 * gaining a map.
 *
 * `location.coordinates` is unread. The static map geocodes `address`, the
 * same string the directions link uses, so there is no second value to keep
 * correct — which matters, because the authored coordinates are marked
 * approximate.
 */
export function LocationMap({ location, zoom = 15, decorations, anchorId }: LocationBlock) {
  const mapped = hasMapKey();

  return (
    <section
      id={anchorId}
      data-reveal
      className={`container-page ${CONTENT_INSET} relative my-[var(--spacing-section)]`}
    >
      <DecorationLayer decorations={decorations} />
      <a
        href={directionsUrl(location.address)}
        target="_blank"
        rel="noopener noreferrer"
        className="group block no-underline"
      >
        {/* label is rendered verbatim; address drives the link, not the display. */}
        {mapped ? (
          <StaticMap address={location.address} zoom={zoom} />
        ) : (
          <MapVisual label={location.label} />
        )}
      </a>
    </section>
  );
}

/**
 * The phone crop's zoom, one step tighter than the authored one.
 *
 * The two crops are shown at wildly different sizes — about 990px wide on a
 * desktop against 278px on a phone — so the same zoom level means the phone is
 * showing the same area shrunk to a quarter of the width, where every street
 * name is illegible. Zooming in trades area for a map you can actually read.
 *
 * One step, not two. The arithmetic says nearly two levels would match the
 * desktop's detail-per-pixel, but at that zoom the phone loses every landmark
 * that makes the location recognisable — the highway exit, the junction — and
 * a map of one unlabelled block is no more use than a small one.
 *
 * Clamped because Google's scale runs out around 21.
 */
function phoneZoom(zoom: number): number {
  return Math.min(zoom + 1, 20);
}

/**
 * The real map: one image, two crops.
 *
 * Two sources rather than one stretched image because Google caps a static
 * map at 640 per side (1280 delivered at scale 2). A single wide image
 * cropped to a phone's 4:3 box would throw away half those pixels and most of
 * the surrounding streets with them, so each shape is requested at the ratio
 * it will be shown at — and at its own zoom, since the two are shown at very
 * different sizes. `<picture>` fetches only the one that matches.
 *
 * The caption sits below the image, never over it. Text on a map is the same
 * unverifiable-contrast problem as text on a photograph — the backdrop varies
 * per pixel and changes whenever the tiles do.
 *
 * alt="" on the image: it is the caption beneath that names the place, and the
 * whole card is one link, so describing the map here would only lengthen that
 * link's accessible name with a duplicate.
 */
function StaticMap({ address, zoom }: { address: string; zoom: number }) {
  const wide = staticMapUrl({ address, zoom, width: 640, height: 320 });
  const tall = staticMapUrl({ address, zoom: phoneZoom(zoom), width: 640, height: 480 });

  return (
    <div>
      <picture>
        {/* 48rem is Tailwind's md, the width the placeholder also changes
            aspect at, so the two treatments crop at the same breakpoint. */}
        <source media="(min-width: 48rem)" srcSet={wide} width={640} height={320} />
        <img
          src={tall}
          alt=""
          width={640}
          height={480}
          className="block aspect-[4/3] w-full rounded-[var(--radius-card)] object-cover md:aspect-[2/1]"
        />
      </picture>

      {/* The visible text is the link's accessible name, with nothing added
          by aria-label. An aria-label naming the place — "View Treehouse Park
          City on Google Maps" — would not contain this string contiguously,
          which is exactly what WCAG's Label in Name forbids. The section
          heading above and the address below already give the context that
          2.4.4 asks for. */}
      <p className="mt-[var(--spacing-gutter)] text-center font-sans text-[length:var(--text-ui)] text-ink-soft">
        <span className="underline group-hover:no-underline">view on Google Maps</span>
      </p>
    </div>
  );
}

/**
 * The no-key fallback, unchanged. Still what renders locally and on any build
 * without NEXT_PUBLIC_GOOGLE_MAPS_STATIC_KEY set.
 *
 * Deliberately unbranded: the grey fill and dashed edge are the same treatment
 * as the placeholder image SVGs, so every unfinished block on the page reads as
 * unfinished. Text is ink and ink-soft on the placeholder grey — 13.22:1 and
 * 6.76:1, both clear AA. The pin is decorative and labelled by the text below.
 */
function MapVisual({ label }: { label: string }) {
  return (
    <div className="flex aspect-[4/3] flex-col items-center justify-center gap-[var(--spacing-gutter)] rounded-[var(--radius-card)] border-2 border-dashed border-[var(--color-placeholder-border)] bg-[var(--color-placeholder)] px-[var(--spacing-gutter)] text-center md:aspect-[2/1]">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-10 fill-none stroke-ink-soft"
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

      {/* aria-hidden: the whole card is one link, so this would otherwise be read
          out as part of its accessible name. It is review scaffolding rather than
          content — remove it along with this placeholder when the real map lands. */}
      <p
        aria-hidden="true"
        className="font-sans text-[length:var(--text-caption)] text-ink-soft"
      >
        placeholder — interactive map to be placed in this block
      </p>
    </div>
  );
}
