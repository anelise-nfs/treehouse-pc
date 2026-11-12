/**
 * The location map.
 *
 * Google's Maps Static API: one `<img>` request, no runtime map library, no
 * iframe. The alternatives were both worse here — the Maps Embed API cannot
 * carry our own pin and swallows clicks, so the card could no longer link to
 * directions, and a JS map SDK would be a dependency this project has no other
 * reason to carry (ARCHITECTURE.md → Dependency discipline).
 *
 * PLACEHOLDER — no key is configured, so the block renders its branded
 * placeholder instead and nothing breaks. See components/blocks/LocationMap.
 *
 * The key is read from the environment rather than written into this file on
 * purpose: it is billable to whoever owns it, and `.gitignore` already covers
 * `.env*`, so a key in `.env.local` never reaches the repository.
 *
 *   .env.local        NEXT_PUBLIC_GOOGLE_MAPS_STATIC_KEY=AIza...
 *   production        the same variable, set in the deploy environment
 *
 * NEXT_PUBLIC_ because this is inlined into the page at build time. There is
 * no hiding it — a static image URL carries its key in the HTML, whatever we
 * do. What makes that safe is not secrecy but an **HTTP referrer restriction**
 * on the key in Google Cloud Console, locked to the live domain. Without one,
 * anybody can lift the key from the page source and spend against it.
 */
const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_STATIC_KEY ?? '';

/** Whether a real map can be rendered at all. */
export function hasMapKey(): boolean {
  if (!KEY && process.env.NODE_ENV !== 'production') {
    console.warn(
      '[map] No NEXT_PUBLIC_GOOGLE_MAPS_STATIC_KEY set — falling back to the placeholder. See lib/map.ts.',
    );
  }
  return Boolean(KEY);
}

/**
 * Pin colour, as Google wants it: `0x` and six hex digits.
 *
 * Mint, matching --color-mint. Pine was tried first and disappeared — a Google
 * basemap is mostly pale greens and beiges, and a dark desaturated green read
 * as part of the terrain rather than as something placed on it. Mint is a
 * green too, but a far more saturated one than anything in the landscape, so
 * it separates where pine did not.
 *
 * The brand mint rather than the brighter doodle mint: the doodle palette is
 * for decoration over our own surfaces, and this marker sits on someone
 * else's imagery.
 *
 * This is a marker, not text, so no contrast ratio applies. What matters is
 * only that it is not lost against the map.
 */
const PIN_COLOR = '0x4da17e';

export interface StaticMapOptions {
  /**
   * A street address, not coordinates. Google geocodes it server-side, which
   * means the map centres on the same authored string that drives the
   * directions link — the two cannot drift apart, and no lat/lng has to be
   * looked up and kept correct by hand.
   */
  address: string;
  zoom: number;
  /**
   * Requested size. Google caps each side at 640; `scale: 2` then returns
   * double that in real pixels, so 640×320 is 1280×640 delivered. That 1280 is
   * the hard ceiling on sharpness, and it is why this is requested at two
   * aspect ratios rather than one wide image scaled down.
   */
  width: number;
  height: number;
}

export function staticMapUrl({ address, zoom, width, height }: StaticMapOptions): string {
  const params = new URLSearchParams({
    center: address,
    zoom: String(zoom),
    size: `${width}x${height}`,
    scale: '2',
    markers: `color:${PIN_COLOR}|${address}`,
    key: KEY,
    // To mute the stale business labels around the pin, add:
    //   style: 'feature:poi.business|visibility:off'
    // It is left off deliberately — the client is correcting the listing at
    // the source, which fixes it in Google Maps proper as well as here.
  });

  return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
}
