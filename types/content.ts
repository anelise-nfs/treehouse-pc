/**
 * Treehouse Park City — content type contract.
 *
 * These types are the boundary between content and presentation. Components are
 * typed against them; `/lib/content.ts` is responsible for producing values that
 * satisfy them. In Phase 1 that means hand-written fixtures in `/content/`; in
 * Phase 2 it means GROQ queries against Sanity. Nothing else in the repo should
 * need to change when that swap happens, which is why the shapes below already
 * mirror Sanity's storage conventions (`_type`, `_key`, image hotspot/crop,
 * portable text) rather than a convenient-for-now invention.
 *
 * Two deliberate flattenings, both handled inside /lib/content.ts so the storage
 * shape never leaks into components:
 *   - Slugs are plain strings here, not Sanity's `{ _type: 'slug', current }`.
 *   - References arrive resolved (GROQ `location->`), not as `{ _ref }`.
 */

import type { DoodleName } from '@/components/doodles/shapes';

export type { DoodleName };

/* ============================================================================
   Primitives
   ========================================================================== */

/**
 * The ten brand colors approved as block backgrounds.
 *
 * This union is the entire color control surface an author gets in Phase 2 —
 * no picker, no hex field. It is also load-bearing for accessibility: `pine`
 * takes white text and every other color takes ink (see ARCHITECTURE.md).
 * Components must read that pairing from the `--color-on-*` tokens rather than
 * choosing a text color themselves.
 */
export type BandColor =
  | 'pine'
  | 'mint'
  | 'tangerine'
  | 'flamingo'
  | 'seafoam'
  | 'sunshine'
  | 'lime'
  | 'tomato'
  | 'sky'
  | 'ocean';

/**
 * Backgrounds that may also be one of the two neutrals. Used where a block is
 * frequently unstyled — a run of brand-colored sections back to back is louder
 * than anything in the mockups.
 */
export type SurfaceColor = BandColor | 'linen' | 'white';

/**
 * The button treatments, and the only ones. Ratios are against linen.
 *
 *   solid-ocean            --color-action fill, white label   (6.62:1)
 *   outline-ocean          --color-action label and border
 *   outline-tangerine      tangerine border, ink label
 *   solid-tangerine-ink    tangerine fill, ink label          (5.44:1)
 *   solid-tangerine-white  temporary, pending the ADA sweep
 *
 * Do not introduce a color to make a new variant work.
 */
export type ButtonVariant =
  | 'solid-ocean'
  | 'outline-ocean'
  | 'outline-tangerine'
  | 'solid-tangerine-ink'
  | 'solid-tangerine-white';

/**
 * Where a doodle may sit inside a block. Named slots, not coordinates: an author
 * picks a corner or an edge, so a placement cannot land on top of a paragraph.
 */
export type DoodleSlot =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'left'
  | 'right';

/**
 * One decorative mark on a block. Pure decoration — it carries no information,
 * never affects layout, and is hidden from assistive tech. In Phase 2 this is
 * what the author-facing picker writes.
 */
export interface Decoration {
  doodle: DoodleName;
  slot: DoodleSlot;
  /** Defaults to the colour the doodle was drawn in. */
  color?: BandColor;
  size?: 'sm' | 'md' | 'lg';
  /**
   * Let this doodle hang past the block's top or bottom edge. Vertical only —
   * horizontal bleed would widen the document and bring back a horizontal
   * scrollbar, which decoration must never do.
   */
  bleed?: boolean;
}

/**
 * Decorative SVG accents, named after the brand guide's element sheet.
 * All are placeholders pending final brand files.
 */
export type AccentShape =
  | 'river'
  | 'squiggle'
  | 'rainbow'
  | 'loop'
  | 'double-loop'
  | 'flowers'
  | 'ribbon'
  | 'bunting'
  | 'checkerboard'
  | 'none';

/**
 * Placeholder icon set. Names are intentionally about meaning, not appearance,
 * so replacing the artwork is one file change and no content edits.
 */
export type IconName =
  | 'play'
  | 'cafe'
  | 'party'
  | 'membership'
  | 'calendar'
  | 'toddler'
  | 'sensory'
  | 'stroller'
  | 'wifi'
  | 'parking';

/**
 * Image shape matching Sanity's asset projection, so the Phase 2 swap is a
 * field-for-field mapping rather than a rewrite.
 *
 * `alt` is required and non-optional on purpose: every image needs it, and
 * decorative images pass `''` explicitly (paired with `aria-hidden` at the
 * render site). Making it optional would let missing alt text ship silently.
 */
export interface SanityImage {
  url: string;
  alt: string;
  /** Focal point, 0–1 in both axes. Drives object-position on cropped renders. */
  hotspot?: ImageHotspot;
  /** Fractional insets from each edge, 0–1. */
  crop?: ImageCrop;
  width?: number;
  height?: number;
  /** Tiny inline preview for blur-up placeholders, when available. */
  lqip?: string;
}

export interface ImageHotspot {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ImageCrop {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**
 * A link is always content, never hardcoded in a component. `kind` decides how
 * it renders: internal uses next/link, external gets rel/target treatment,
 * anchor scrolls within the page.
 *
 * Omitting `variant` renders an inline text link. Setting it renders a button.
 */
export interface Link {
  label: string;
  kind: LinkKind;
  /** Internal: a site-relative path ('/early-bird'). External: absolute URL. Anchor: '#membership'. */
  href: string;
  /** External links only. Ignored elsewhere. */
  newTab?: boolean;
  variant?: ButtonVariant;
}

export type LinkKind = 'internal' | 'external' | 'anchor';

/* ---------------------------------------------------------------------------
   Portable text

   Rich text is structured from day one. Storing HTML or markdown strings now
   would mean a conversion pass in Phase 2 and would hand the author raw markup,
   which the block-component contract exists to prevent.
   ------------------------------------------------------------------------- */

/** No `h1`: the single page-level h1 belongs to the hero, not to body copy. */
export type PortableTextStyle = 'normal' | 'h2' | 'h3' | 'h4' | 'blockquote';

export type PortableTextMark = 'strong' | 'em' | 'underline';

export interface PortableTextSpan {
  _type: 'span';
  _key: string;
  text: string;
  /** Decoration names ('strong') and/or `_key`s pointing into `markDefs`. */
  marks: string[];
}

/** Annotations referenced by `_key` from a span's `marks`. */
export interface PortableTextLinkMarkDef {
  _type: 'link';
  _key: string;
  href: string;
  kind: LinkKind;
  newTab?: boolean;
}

export type PortableTextMarkDef = PortableTextLinkMarkDef;

export interface PortableTextBlock {
  _type: 'block';
  _key: string;
  style: PortableTextStyle;
  children: PortableTextSpan[];
  markDefs: PortableTextMarkDef[];
  listItem?: 'bullet' | 'number';
  /** Nesting depth for list items, 1-based. */
  level?: number;
}

/* ============================================================================
   Blocks
   ========================================================================== */

/**
 * Blocks that can carry doodles. Optional everywhere — decoration is never
 * required, and a block with none emits no layer at all.
 *
 * Every content block extends this. The exceptions are pageHeader and the site
 * footer: both are photographic or full-bleed chrome with their own fixed
 * scrim, where a doodle has nothing to sit against. A new block should extend
 * Decorated unless it is one of those.
 */
interface Decorated {
  decorations?: Decoration[];
}

interface BlockBase {
  /** Stable identity for React keys and for Phase 2 visual editing overlays. */
  _key: string;
  /**
   * Optional in-page anchor target, so a CTA can link to '#membership' without
   * a component hardcoding an id.
   */
  anchorId?: string;
}

/**
 * Page opener. Layered by design (see hero_redesign.png):
 *
 *   image                photography, full bleed
 *   overlayHeadline      sans, right-aligned, sits ON the image
 *   scriptHeadline       script band overlapping the image's bottom edge and
 *                        extending down into the section below
 *   subhead              serif, below the band
 *
 * The overlay headline sits over photography that will be swapped later, so the
 * component applies a fixed scrim behind it. These are permanent, not author
 * options — otherwise legibility depends on whichever photo is chosen:
 *
 *   desktop  linear-gradient to left, rgba(0,0,0,0.55) at the right edge fading
 *            to transparent ~55% across, so the play structure on the left keeps
 *            full contrast
 *   mobile   headline centers, so bottom-up instead: rgba(0,0,0,0.55) at the
 *            bottom fading to transparent ~60% up
 *   both     text-shadow 0 1px 3px rgba(0,0,0,0.4) on the overlay headline
 *
 * This block absorbs what used to be a separate intro richText block.
 *
 * `overlayHeadline` is the page's h1 — it is the substantive statement about
 * what the business is. `scriptHeadline` is display type, not a heading.
 */
export interface HeroBlock extends BlockBase, Decorated {
  _type: 'hero';
  image: SanityImage;
  overlayHeadline: string;
  overlayCta?: Link;
  scriptHeadline: string;
  /** Script type is illegible at 375px past a certain length. */
  mobileScriptHeadline?: string;
  bandColor: BandColor;
  subhead: PortableTextBlock[];
  primaryCta: Link;
}

/**
 * Full-bleed color band with a script heading. The signature Treehouse device.
 *
 * `level` exists because the mockups nest them: "how it works" is a primary,
 * full-width band, and "early bird gets the worm" sits inside it as a narrower
 * secondary band. Same relationship for "drop-in play".
 *
 * Bands always render as h2. The h1 comes from a hero or a pageHeader.
 *
 * The band's script heading renders at display scale on every breakpoint. Some
 * band colors only clear contrast at the large-text threshold — white on ocean
 * is 3.56:1, which passes at 3:1 for large display type and nowhere else — so
 * `mobileHeading` is a shorter string, never a smaller one.
 */
export interface SectionBandBlock extends BlockBase, Decorated {
  _type: 'sectionBand';
  heading: string;
  /** Shorter script heading for narrow viewports. See ARCHITECTURE.md → Mobile. */
  mobileHeading?: string;
  eyebrow?: string;
  body?: PortableTextBlock[];
  color: BandColor;
  level: BandLevel;
  accent?: AccentShape;
}

export type BandLevel = 'primary' | 'secondary';

/**
 * Sub-page opener: a title over a photograph, with the site header overlaying it
 * exactly as it does the homepage hero. Image background only — there is no
 * solid-color variant.
 *
 * `title` is the page's h1 on any page that uses this block.
 *
 * Fixed treatment, not author-facing, for the same reason as the hero's:
 *
 *   height small   clamp(140px, 18vw, 200px)
 *   height medium  clamp(220px, 30vw, 380px)
 *   title          --text-h2 scale, Quicksand semibold, centered, white
 *   scrim          rgba(0,0,0,0.55) at the bottom fading to transparent ~70% up
 *   title shadow   0 1px 3px rgba(0,0,0,0.4)
 */
export interface PageHeaderBlock extends BlockBase {
  _type: 'pageHeader';
  /** Title case. Renders as the h1. */
  title: string;
  image: SanityImage;
  height: PageHeaderHeight;
}

export type PageHeaderHeight = 'small' | 'medium';

export interface RichTextBlock extends BlockBase, Decorated {
  _type: 'richText';
  heading?: string;
  content: PortableTextBlock[];
  /**
   * Smaller muted line beneath `content`, set in sans. Separate from `content`
   * so the styling difference is authored rather than inferred from position.
   */
  subcopy?: PortableTextBlock[];
  /** 'measure' caps line length at ~68ch; 'full' spans the container. */
  width?: 'measure' | 'full';
  align?: 'left' | 'center';
  backgroundColor?: SurfaceColor;
}

/**
 * Script heading colors available to an ImageTextSplit. A subset of the palette,
 * not all of BandColor: these render as text on linen, where most of the brand
 * colors are too light to read.
 */
export type SplitHeadingColor = 'pine' | 'ocean' | 'tomato' | 'tangerine';

export interface ImageTextSplitBlock extends BlockBase, Decorated {
  _type: 'imageTextSplit';
  heading?: string;
  headingColor: SplitHeadingColor;
  body: PortableTextBlock[];
  image: SanityImage;
  /** Desktop only. Mobile always stacks image-above-text for reading order. */
  imageSide: 'left' | 'right';
  cta?: Link;
  backgroundColor?: SurfaceColor;
  accent?: AccentShape;
}

export interface PhotoGalleryBlock extends BlockBase, Decorated {
  _type: 'photoGallery';
  heading?: string;
  images: SanityImage[];
  layout: GalleryLayout;
  caption?: string;
}

/**
 * 'single' is one full-width image with no accompanying text (the early bird
 * page's 3D render). No carousel: it would mean an animation dependency and a
 * keyboard-navigation problem.
 */
export type GalleryLayout = 'single' | 'grid' | 'strip' | 'featured';

export interface FeatureGridBlock extends BlockBase, Decorated {
  _type: 'featureGrid';
  /** Required: the grid names itself rather than relying on a band above it. */
  heading: string;
  subheading?: string;
  items: FeatureItem[];
  columns: 2 | 3 | 4;
  backgroundColor?: SurfaceColor;
}

export interface FeatureItem {
  _key: string;
  title: string;
  /** Short line under the title — 'up to 16 kids'. */
  caption?: string;
  image: SanityImage;
  link?: Link;
}

/**
 * The whole "early bird gets the worm" section as one block: title band, tier
 * cards, and the intro/CTA/perks column beside them.
 *
 * Deliberately not a pricingTable next to a perksList next to a sectionBand.
 * The three are one designed unit with a fixed internal arrangement, and an
 * author reordering or separating them would produce something the design does
 * not account for.
 */
export interface MembershipSectionBlock extends BlockBase, Decorated {
  _type: 'membershipSection';
  /** Omitted where a pageHeader already names the section; the bar is then skipped. */
  title?: string;
  titleBandColor?: BandColor;
  tiers: PricingTier[];
  /** Fine print under the last card — annual billing terms. */
  tiersFootnote?: string;
  intro: PortableTextBlock[];
  cta: Link;
  perksTitle: string;
  perks: MembershipPerk[];
}

export interface MembershipPerk {
  _key: string;
  /** Short colored label — 'best rates'. */
  label: string;
  description: string;
}

/**
 * The whole drop-in section: title bar, the row of price badges, and the copy
 * beneath them. Same shape as MembershipSectionBlock — a designed unit with a
 * fixed internal arrangement rather than three separately orderable blocks.
 *
 * The badges are circles that become full-width cards below 640px, per
 * ARCHITECTURE.md → Mobile.
 */
export interface DropInSectionBlock extends BlockBase, Decorated {
  _type: 'dropInSection';
  title: string;
  titleBandColor: BandColor;
  badges: PriceBadge[];
  body: PortableTextBlock[];
  /** Smaller closing line, set in sans below the body. */
  footnote?: string;
}

export interface PriceBadge {
  _key: string;
  label: string;
  /**
   * A display string, not a number. Drop-in pricing has no arithmetic
   * relationship to anything — '$28', 'free with sibling'.
   */
  price: string;
  /**
   * Qualifier set smaller beneath the price — 'with sibling' under 'free'. A
   * separate field rather than a longer `price` string so the component never
   * has to split one, and so an author controls where the break falls.
   */
  priceNote?: string;
  note?: string;
  /** Fill behind the label half. The price half below it uses `priceColor`. */
  labelColor: BandColor;
  priceColor: BandColor;
}

export interface PartyPackagesBlock extends BlockBase, Decorated {
  _type: 'partyPackages';
  heading?: string;
  intro?: PortableTextBlock[];
  packages: PartyPackage[];
  link?: Link;
  backgroundColor?: SurfaceColor;
}

/**
 * The map block. Deliberately renderer-agnostic: a flat display address and
 * optional coordinates are what every map implementation needs, so the shape
 * does not change when the placeholder becomes a Mapbox static image and later
 * an interactive map. See components/blocks/LocationMap.tsx.
 */
export interface LocationBlock extends BlockBase, Decorated {
  _type: 'locationBlock';
  location: MapLocation;
  /** Unused by the placeholder; consumed once a real map renders. */
  zoom?: number;
}

export interface MapLocation {
  /**
   * Display name on the card, authored — never derived from the address, the
   * coordinates, or a Google lookup. Google will not reliably return a business
   * name for a business that has not opened, and site copy should not depend on
   * their database either way. Required, so a location cannot render nameless.
   * With multiple locations later, each carries its own.
   */
  label: string;
  /**
   * Single-line. Drives the pin and the directions URL only — it is independent
   * of `label`, which is what the card displays.
   */
  address: string;
  coordinates?: { lat: number; lng: number };
}

/**
 * Opening hours and the postal address, side by side.
 *
 * `location` is resolved from SiteSettings by /lib/content.ts, not authored:
 * hours and the address also appear in the footer and change often, so they
 * have exactly one home.
 */
export interface HoursAddressBlock extends BlockBase, Decorated {
  _type: 'hoursAddress';
  location?: Location;
}

export interface FaqAccordionBlock extends BlockBase, Decorated {
  _type: 'faqAccordion';
  heading?: string;
  intro?: PortableTextBlock[];
  items: FaqItem[];
  backgroundColor?: SurfaceColor;
}

/** Parked for Phase 2 (Memberships, Parties): built, unused by the launch pages. */
export interface CtaBannerBlock extends BlockBase, Decorated {
  _type: 'ctaBanner';
  heading: string;
  mobileHeading?: string;
  body?: string;
  /** Required and always authored. No component ever hardcodes a destination. */
  link: Link;
  secondaryLink?: Link;
  color: BandColor;
  variant: CtaVariant;
  accent?: AccentShape;
}

export type CtaVariant = 'band' | 'card' | 'inline';

/**
 * ROLLER booking/waiver widget.
 *
 * `fallbackLink` is not optional: embeds get blocked by tracking protection
 * often enough that a plain link out has to always be present.
 */
export interface BookingEmbedBlock extends BlockBase, Decorated {
  _type: 'bookingEmbed';
  heading?: string;
  body?: PortableTextBlock[];
  provider: BookingProvider;
  embedUrl: string;
  fallbackLink: Link;
  /** Reserved height, in px, to avoid layout shift while the iframe loads. */
  minHeight?: number;
  backgroundColor?: SurfaceColor;
}

export type BookingProvider = 'placeholder' | 'roller' | 'custom';

export interface DividerBlock extends BlockBase, Decorated {
  _type: 'divider';
  shape: AccentShape;
  color?: BandColor;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Every block a page can be composed from, discriminated on `_type`.
 *
 * Adding a member here is a compile error in BlockRenderer until a case is
 * handled, which is the intended way to add a block.
 */
export type Block =
  | HeroBlock
  | PageHeaderBlock
  | SectionBandBlock
  | RichTextBlock
  | ImageTextSplitBlock
  | PhotoGalleryBlock
  | FeatureGridBlock
  | MembershipSectionBlock
  | DropInSectionBlock
  | PartyPackagesBlock
  | LocationBlock
  | HoursAddressBlock
  | FaqAccordionBlock
  | CtaBannerBlock
  | BookingEmbedBlock
  | DividerBlock;

/** Convenience for typing a single block component's props by `_type`. */
export type BlockOfType<T extends Block['_type']> = Extract<Block, { _type: T }>;

/* ============================================================================
   Documents
   ========================================================================== */

/**
 * How large the header wordmark renders. The homepage hero carries a larger
 * lockup than a sub-page pageHeader; derived from the page's opening block
 * rather than authored, so it cannot get out of step with the layout.
 */
export type HeaderLogoSize = 'default' | 'large';

export interface SeoMeta {
  /** Falls back to the page title when absent. */
  title?: string;
  description?: string;
  ogImage?: SanityImage;
  noIndex?: boolean;
}

export interface Page {
  _id: string;
  _type: 'page';
  title: string;
  /** Flattened from Sanity's slug object. Home is ''. */
  slug: string;
  seo?: SeoMeta;
  blocks: Block[];
  /**
   * Only one location exists today. Carrying the reference now means a second
   * location is a content change rather than a routing change.
   */
  location?: Location;
}


export interface Location {
  _id: string;
  _type: 'location';
  name: string;
  slug: string;
  address: PostalAddress;
  phone?: string;
  email?: string;
  /** Ordered for display; open-ended so 'Holidays — see socials' is expressible. */
  hours?: OpeningHours[];
  mapUrl?: string;
  mapEmbedUrl?: string;
  geo?: { lat: number; lng: number };
  /** Pre-opening notice, e.g. 'Opening this winter'. */
  status?: string;
}

export interface PostalAddress {
  street: string;
  street2?: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export interface OpeningHours {
  _key: string;
  /** Display label, not a parsed day: covers 'Mon–Thu' and 'Holidays' alike. */
  days: string;
  /** Display string, not times: covers 'Closed' and '8am – 7pm' alike. */
  hours: string;
}

/**
 * Membership pricing.
 *
 * Amounts are numbers, not display strings, because founding memberships show a
 * monthly figure while billing annually up front and both have to render from
 * one source. A tier showing "$135 a month, billed $1,620 annually" is:
 *
 *   amount 135, interval 'month', compareAtAmount 145,
 *   billedAmount 1620, billedInterval 'year'
 *
 * Formatting (currency symbol, strikethrough) is the component's job.
 */
export interface PricingTier {
  _id: string;
  _type: 'pricingTier';
  name: string;
  /** The headline figure, in whole dollars. */
  amount: number;
  /** The unit the headline figure is displayed in. */
  interval: PriceInterval;
  /** Struck-through original, in whole dollars. Absent when there is no discount. */
  compareAtAmount?: number;
  /** What the customer is actually charged, when it differs from `amount`. */
  billedAmount?: number;
  billedInterval?: BillingInterval;
  description?: string;
  features: TierFeature[];
  /** At most one tier should set this; enforced in content, not in types. */
  featured?: boolean;
  badge?: string;
  /** Fill behind the tier name. The price row below it uses `priceColor`. */
  headerColor: BandColor;
  priceColor: BandColor;
  cta?: Link;
  /** Founding-membership scarcity counter. Static in Phase 1. */
  limitNote?: string;
}

export type PriceInterval = 'month' | 'year';
export type BillingInterval = 'month' | 'year' | 'once';

export interface TierFeature {
  _key: string;
  text: string;
  /** Renders as struck-through / muted rather than being omitted. */
  excluded?: boolean;
}

export interface PartyPackage {
  _id: string;
  _type: 'partyPackage';
  name: string;
  slug: string;
  /**
   * One display string — '$25/child (parties start at $300)'. Party pricing is
   * per-child plus a floor, with no arithmetic, and the design sets the whole
   * line at one size, so it is not split into a price and a note.
   */
  priceLine: string;
  duration?: string;
  guestCount?: string;
  description?: PortableTextBlock[];
  includes: PackageInclusion[];
  image?: SanityImage;
  color: BandColor;
  cta?: Link;
  location?: Location;
}

export interface PackageInclusion {
  _key: string;
  text: string;
  icon?: IconName;
}

export interface FaqItem {
  _id: string;
  _type: 'faqItem';
  question: string;
  answer: PortableTextBlock[];
  /** Groups questions into sections; also the filter for per-page FAQ subsets. */
  category?: FaqCategory;
  /** Ascending. Ties fall back to source order. */
  order?: number;
  location?: Location;
}

export type FaqCategory = 'visiting' | 'membership' | 'parties' | 'cafe' | 'accessibility';

export interface SiteSettings {
  _id: string;
  _type: 'siteSettings';
  siteName: string;
  tagline?: string;
  logo?: SanityImage;
  /** Square mark for favicons and small placements. */
  logoMark?: SanityImage;
  /**
   * Single-color white wordmark, for dark surfaces. A distinct asset rather
   * than a filter over the full-color logo, which would muddy it.
   */
  logoWhite?: SanityImage;
  /** At launch: the two links inside the hamburger menu. */
  primaryNav: Link[];
  footerNav?: Link[];
  navCta?: Link;
  socialLinks?: SocialLink[];
  footerNote?: PortableTextBlock[];
  /** Secondary links in the footer's bottom bar — privacy, terms. */
  legalNav?: Link[];
  defaultSeo?: SeoMeta;
  location?: Location;
}

export interface SocialLink {
  _key: string;
  platform: SocialPlatform;
  url: string;
  /** Accessible name; defaults to the platform name when absent. */
  label?: string;
}

export type SocialPlatform = 'instagram' | 'facebook' | 'tiktok' | 'youtube';
