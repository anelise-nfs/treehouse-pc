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
 * Tangerine. The basemap below is now a muted cream, sage and sand palette
 * with nothing saturated anywhere in it, so a warm orange is the only thing on
 * the image that is a strong colour — it reads as placed rather than as
 * terrain. This replaced mint, which was chosen against Google's stock
 * basemap: mint separated from that one's greens, but against our own pale
 * sage parks it is the same family again.
 *
 * NOTE: this is #ed671d, the doodle-palette tangerine, not the darkened brand
 * --color-tangerine (#cc4800). The doodle palette is otherwise reserved for
 * decoration over our own surfaces; a marker on someone else's imagery is a
 * deliberate exception, since the brighter value is what survives against map
 * tiles.
 *
 * This is a marker, not text, so no contrast ratio applies. What matters is
 * only that it is not lost against the map.
 */
const PIN_COLOR = '0xED671D';

/**
 * The muted brand basemap.
 *
 * Held as the same object shape Google's Styling Wizard exports, rather than
 * as pre-built query strings, for two reasons: a restyle is then a paste over
 * this array instead of nineteen hand-encoded strings, and the translation to
 * Static Maps syntax lives in one tested place rather than in every rule.
 *
 * ORDER IS LOAD-BEARING. The API applies these in sequence and a later rule
 * overrides an earlier one on the same feature and element — the first entry
 * paints every geometry cream, and everything after it carves exceptions out
 * of that. Re-ordering the array changes the map.
 */
interface MapStyler {
  color?: string;
  visibility?: string;
}

interface MapStyleRule {
  /** Omitted means every feature type. */
  featureType?: string;
  /** Omitted means every element of the feature. */
  elementType?: string;
  stylers: MapStyler[];
}

const MAP_STYLE: MapStyleRule[] = [
  { elementType: 'geometry', stylers: [{ color: '#fbf6ee' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#6b6a63' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#fbf6ee' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.neighborhood', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ visibility: 'on' }, { color: '#d9e5cf' }],
  },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#e7eede' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#efe7da' }] },
  { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#e8dfd0' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#e2d6c2' }] },
  { featureType: 'road.highway', elementType: 'labels', stylers: [{ visibility: 'simplified' }] },
  { featureType: 'road.local', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c7ddd4' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#8fab9f' }] },
];

/**
 * One rule as a `style` parameter value: `feature:…|element:…|color:0x…`.
 *
 * The pipes are written raw and left to URLSearchParams, which percent-encodes
 * them to %7C on the way out. Encoding them here would double-encode.
 *
 * Colours convert from CSS `#rrggbb` to Google's `0xrrggbb`; the wizard emits
 * the first form and the API only accepts the second.
 */
function toStyleParam({ featureType, elementType, stylers }: MapStyleRule): string {
  const parts: string[] = [];

  if (featureType) parts.push(`feature:${featureType}`);
  if (elementType) parts.push(`element:${elementType}`);

  for (const styler of stylers) {
    if (styler.color) parts.push(`color:0x${styler.color.replace('#', '')}`);
    if (styler.visibility) parts.push(`visibility:${styler.visibility}`);
  }

  return parts.join('|');
}

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
    // The default, stated rather than assumed: the style array below is built
    // for the roadmap basemap and would be ignored on satellite or terrain.
    maptype: 'roadmap',
    // No `label:` — a lettered pin would put a glyph on the one mark that is
    // meant to read as a shape. The caption below the image names the place.
    markers: `color:${PIN_COLOR}|${address}`,
    key: KEY,
  });

  // One `style` per rule. append, not the constructor: a URLSearchParams built
  // from an object holds one value per key, and this parameter repeats.
  for (const rule of MAP_STYLE) params.append('style', toStyleParam(rule));

  return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
}
