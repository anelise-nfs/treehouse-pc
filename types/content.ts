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
  /**
   * Width step. The heights follow each doodle's own aspect ratio, so a tall
   * narrow shape reads much larger than a flat one at the same step.
   *
   *   xs   48px   a punctuation mark beside something small
   *   sm   96px   a corner accent in a compact block
   *   md  160px   the default, tuned for the full-width image/text blocks
   *   lg  224px
   *
   * 'sm' used to be 48px with nothing between it and the default's 160. The
   * sub-page header needed a mark in that gap — 160 dwarfed a 50px title and
   * 48 read as a speck — so the step moved in and 'xs' took the old value.
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';
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

/**
 * 'newsletter' is a destination rather than a URL: it opens the mailing-list
 * dialog. It still carries an href to the footer's signup, so a visitor
 * without JavaScript gets taken somewhere real instead of nowhere.
 */
export type LinkKind = 'internal' | 'external' | 'anchor' | 'newsletter';

/**
 * One entry in the site navigation: a reference to a page, not a URL.
 *
 * This is the Sanity shape, built now so Phase 2 is a storage swap and not a
 * rework. In Sanity `page` becomes a reference field whose options are the
 * page documents themselves, so an editor picks any page from a list and the
 * path is derived from that page's slug. They cannot type a URL, which means
 * they cannot point the nav at a route that does not exist, and renaming a
 * page's slug moves its nav entry with it.
 *
 * /lib/content.ts resolves these to Links at the edge, so nav components keep
 * taking plain Links and know nothing about pages.
 */
export interface NavItem {
  /** The target page's slug. The homepage's slug is the empty string. */
  page: string;
  /**
   * Overrides the page's own title in the nav. Usually set: page titles are
   * written for the page ('hey, early bird!') and nav labels for the bar
   * ('Early Bird').
   */
  label?: string;
}

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

/**
 * A table sitting among the blocks of a document body.
 *
 * NOT a portable-text block, and deliberately not expressed as one: portable
 * text has no table primitive. In Sanity a table in a rich-text field is a
 * separate object type in the same array — which is what `@sanity/table`
 * produces — so a body is a union and the renderer discriminates on `_type`.
 * Modelling it that way now means Phase 2 changes where the array comes from
 * and not what shape it has.
 *
 * Cells are plain strings. The tables that need this are rate grids with no
 * links and no emphasis, and giving a cell portable text of its own would
 * invite a document inside a table cell.
 */
export interface PortableTextTable {
  _type: 'table';
  _key: string;
  /** The header row, rendered as `<th scope="col">`. */
  head: string[];
  /**
   * The body rows. The FIRST CELL OF EACH IS A ROW HEADER and renders as
   * `<th scope="row">`, which is what lets a screen reader announce '2
   * Children' before reading out a figure in that row. A rate table whose
   * first column is not a label does not belong in this type.
   */
  rows: { _key: string; cells: string[] }[];
}

/**
 * A document body: portable-text blocks plus the objects that sit among them.
 *
 * `PortableTextBlock[]` is assignable to this, so a field that only ever holds
 * prose can stay typed as the narrower array and every existing caller is
 * unaffected.
 */
export type PortableTextContent = PortableTextBlock | PortableTextTable;

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
/**
 * The band directly beneath the hero.
 *
 * Part of HeroBlock rather than a block of its own because its seam continues
 * the hero's curve: the two share a clip-path endpoint, a width variable and a
 * scroll animation, and separating them would let any of the three drift. It
 * cannot be placed anywhere else, and nothing else can sit between the two.
 */
export interface HeroAfterBand {
  /** Script heading, white on the fill. */
  heading: string;
  body: PortableTextBlock[];
  cta?: Link;
  /** Decorative graphic on the linen side. */
  image: SanityImage;
  /** Fill on the colour side. Defaults to mint. */
  color?: BandColor;
}

export interface HeroBlock extends BlockBase, Decorated {
  _type: 'hero';
  image: SanityImage;
  /** The h1, set in the script face. */
  scriptHeadline: string;
  /** Script type is illegible at 375px past a certain length. */
  mobileScriptHeadline?: string;
  /** The h2 beneath it. */
  overlayHeadline: string;
  primaryCta: Link;
  /** Edge colour echoed along the S-curve seam behind the photograph. */
  bandColor: BandColor;
  /** Optional band below, whose seam continues this one's curve. */
  afterBand?: HeroAfterBand;
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
 * Sub-page opener: the page's h1 on linen beside a photograph, split by the
 * same S-curve the homepage hero uses.
 *
 * Nothing overlays the photograph — not the title, not the site header, which
 * on these pages is the solid cream top bar sitting above this block in normal
 * flow. That is the point of the treatment: no text on an image means no
 * contrast that varies per pixel, and no wordmark on one either.
 *
 * Shorter than the hero and deliberately still: the hero's scroll choreography
 * and the colour band and tree ring beneath it are homepage-specific and have
 * no counterpart here.
 *
 * `title` is the page's h1 on any page that uses this block.
 */
export interface PageHeaderBlock extends BlockBase, Decorated {
  _type: 'pageHeader';
  /** Title case. Renders as the h1. */
  title: string;
  image: SanityImage;
  height: PageHeaderHeight;
  /**
   * The seam's painted edge — the offset echo of the curve behind the photo,
   * the same device the hero uses. Defaults to mint, matching it.
   */
  bandColor?: BandColor;
  /**
   * `decorations` renders inside the linen title column rather than across the
   * whole block, so 'top-right' and 'bottom-left' are the corners of the text
   * area and not of the photograph. Those two are the slots this opener is
   * built around; the others resolve, but the column is short and a mark in
   * the middle of one of its edges has nowhere to sit.
   */
}

/** Total section height, not the photograph's: the two columns share it. */
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
  /** Omitted leaves the script heading in ink, which is its default on linen. */
  headingColor?: ScriptHeadingColor;
  /**
   * Optional button below the copy, the same field ImageTextSplit carries.
   * A passage of copy that ends in an action is common enough to belong on
   * the general copy block; the alternative was ctaBanner, which is parked
   * for Phase 2 and renders nothing.
   */
  cta?: Link;
}

/**
 * Script heading colors available to an ImageTextSplit. A subset of the palette,
 * not all of BandColor: these render as text on linen, where most of the brand
 * colors are too light to read.
 */
/**
 * The colours approved for a script heading sitting on linen, shared by every
 * block that renders one. Named for the treatment rather than for the first
 * block that used it, which is now one of two.
 *
 * Mint is deliberately absent: at 3.01:1 it clears the large-text bar by 0.01
 * and nothing else. See ARCHITECTURE.md -> Color rule.
 */
export type ScriptHeadingColor = 'pine' | 'ocean' | 'tomato' | 'tangerine' | 'lime';

export interface ImageTextSplitBlock extends BlockBase, Decorated {
  _type: 'imageTextSplit';
  heading?: string;
  headingColor: ScriptHeadingColor;
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
/**
 * The list on /press.
 *
 * `items` is declared but not authored on the page — lib/content.ts fills it,
 * the same way it fills `hoursAddress.location`, which is what GROQ's join
 * will do in Phase 2. Authoring the items into the page fixture would mean the
 * Sanity swap changed the page's shape and not just its source.
 *
 * Renders nothing but its heading when the list is empty, so a press page with
 * no coverage yet is not a broken page.
 */
export interface PressListBlock extends BlockBase, Decorated {
  _type: 'pressList';
  heading?: string;
  items: PressItem[];
}

export interface MembershipSectionBlock extends BlockBase, Decorated {
  _type: 'membershipSection';
  /** Omitted where a pageHeader already names the section; the bar is then skipped. */
  title?: string;
  titleBandColor?: BandColor;
  tiers: PricingTier[];
  /** Fine print under the last card — annual billing terms. */
  tiersFootnote?: string;
  /**
   * One small link under that fine print, for a document a buyer may want
   * before committing — the membership agreement.
   *
   * ITS OWN FIELD RATHER THAN A LINK INSIDE `tiersFootnote`, which is a plain
   * string and has nowhere to put one. Separate from `cta` and `secondaryCta`
   * for the opposite reason to theirs: those are buttons and this must not
   * look like one. It renders as quiet underlined text at the footnote's size,
   * below the prices, where someone reading the terms is already looking.
   *
   * Optional, and only /early-bird sets it. The homepage renders the same
   * section without it.
   */
  tiersFootnoteLink?: Link;
  intro: PortableTextBlock[];
  /**
   * The sale-status announcement, set apart from the prose above it.
   *
   * ITS OWN FIELD, not a styled paragraph inside `intro`. The two are
   * different kinds of writing — one is the standing pitch, the other is a
   * status that changes the day the sale opens — and only one of them should
   * look like an announcement. This is the same split RichTextBlock makes
   * between `content` and `subcopy`, for the same reason: an author should not
   * have to know that a particular paragraph gets picked up and treated
   * differently from the rest.
   *
   * It matters more in Phase 2 than now. `intro` becomes a rich-text field an
   * author edits freely; if the emphasis lived in an inline mark inside it,
   * rewriting the sentence would silently drop the styling, and nothing would
   * stop the same treatment being applied to an unrelated paragraph. With a
   * field, the author owns the words and the component owns the appearance —
   * which is the whole arrangement ARCHITECTURE.md's block contract describes.
   */
  notice?: PortableTextBlock[];
  /**
   * Optional: /early-bird drops it while the sale is not open, leaving the
   * newsletter opt-in below as the only action. A section with neither is
   * valid too — it just reads as information.
   */
  cta?: Link;
  /**
   * Optional second button beside the primary one, for the newsletter opt-in.
   * Separate from `cta` rather than an array: the two are not peers, and the
   * styling difference between a primary and a secondary action is the point.
   */
  secondaryCta?: Link;
  /** Heading over `perks` — the founding-exclusive list ('early birds get:'). */
  perksTitle: string;
  /** Perks a founding member gets and a later member does not. */
  perks: MembershipPerk[];
  /**
   * A second, separate perk list: what every membership includes, founding or
   * not ('all members will enjoy'). Kept distinct from `perks` rather than
   * appended to it because the difference is the selling point — merging the
   * two would quietly claim the standing benefits as founding exclusives.
   *
   * Optional, and only rendered when both the title and a non-empty list are
   * present, so a section that offers nothing beyond the founding perks
   * renders exactly as it did before.
   */
  memberPerksTitle?: string;
  memberPerks?: MembershipPerk[];
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
   * Qualifier shown in plain ink beneath the circle — 'up to age 3'. It sits
   * outside the badge rather than inside it: on the pale fills this was the
   * least readable text on the page.
   */
  note?: string;
  /** The badge's colour: its ring, and its label text. */
  labelColor: BandColor;
  /**
   * UNUSED. The badge was two filled halves with a colour each; it is now one
   * outlined circle with one colour, taken from `labelColor` above. Nothing
   * renders this. Kept only so the three badges in content do not need editing
   * for a field that costs nothing — delete it and them together.
   */
  priceColor?: BandColor;
}


/**
 * A mailing-list signup placed in a page's flow, with its own heading and
 * intro above it.
 *
 * The same NewsletterSignup the footer and the dialog render — one signup
 * implementation, one endpoint. This block only supplies the copy around it
 * and a place to stand.
 *
 * Does not take the `#newsletter` anchor: the footer's copy owns that, and two
 * elements answering to one hash is a bug rather than a redundancy.
 */
export interface NewsletterSignupBlock extends BlockBase, Decorated {
  _type: 'newsletterSignup';
  heading?: string;
  intro?: PortableTextBlock[];
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

/**
 * A long-form legal document: privacy policy, terms of use.
 *
 * Its own block rather than a richText with different classes, because the
 * typography is a different system and not a variant of one. These run to
 * thousands of words of numbered clauses that someone reads to find one
 * sentence, so they want a tighter measure, smaller headings and closer
 * leading than any marketing block on the site — and they must never pick up
 * a change made to richText for a two-line intro paragraph.
 *
 * `body` carries the whole document in order, headings and lists included, so
 * the attorney's structure survives as one authored sequence rather than being
 * split across fields that a future edit could reorder.
 */
export interface LegalDocumentBlock extends BlockBase, Decorated {
  _type: 'legalDocument';
  /** The entity line above the title — 'Treehouse LLC | Park City, Utah'. */
  eyebrow?: string;
  /**
   * Rendered verbatim and marked up as a <time> where it parses.
   *
   * OMITTED ON A DOCUMENT WHOSE DATE IS FILLED IN PER SIGNER. The membership
   * agreement is executed at checkout and its effective date is whatever day
   * that happens, so printing one here would state a fact the page cannot
   * know. Put a version marker in `eyebrow` instead.
   */
  effectiveDate?: string;
  /** Prose and tables in one authored sequence; see PortableTextContent. */
  body: PortableTextContent[];
}

export interface FaqAccordionBlock extends BlockBase, Decorated {
  _type: 'faqAccordion';
  heading?: string;
  intro?: PortableTextBlock[];
  /**
   * Declared but not authored on the page — lib/content.ts fills it from the
   * FAQ documents, the same way it fills pressList.items. The questions are
   * their own documents in Phase 2 and a page fixture holding copies of them
   * would make that swap a shape change rather than a source change.
   */
  sections: FaqSection[];
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
  | PressListBlock
  | LegalDocumentBlock
  | DropInSectionBlock
  | PartyPackagesBlock
  | NewsletterSignupBlock
  | LocationBlock
  | HoursAddressBlock
  | FaqAccordionBlock
  | CtaBannerBlock
  | BookingEmbedBlock;

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

/**
 * Which site header a page gets.
 *
 * 'overlay' is the homepage treatment: a transparent bar sitting on the hero,
 * with the hamburger that opens the slide-in panel. 'topbar' is the sub-page
 * treatment: a solid cream bar in normal flow, sticky, wordmark left and the
 * links laid out across it, with no panel at all.
 *
 * Authored per page rather than derived from the blocks, unlike the two
 * settings below it. Which header a page wears is an editorial decision — the
 * client's, not something to be read off whether block zero happens to be a
 * hero — and inferring it meant a page could change its chrome by having its
 * opening block swapped.
 */
export type HeaderVariant = 'overlay' | 'topbar';

/**
 * What sits behind the header on a given route, which decides how it draws
 * itself: ink on a light surface, white over a protective scrim on a photo.
 *
 * Only consulted for 'overlay' pages — the top bar is opaque and paints itself
 * the same way everywhere. With the homepage the only overlay page today, the
 * 'photo' branch is currently unreachable; it stays because the overlay header
 * is still general, and a second overlay page would need it.
 */
export type HeaderSurface = 'light' | 'photo';

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
  /**
   * Required, with no default: a new page has to say which header it wears.
   * An optional field would have let one be added without the decision being
   * made, and it would have defaulted to whatever the homepage happens to use.
   */
  headerVariant: HeaderVariant;
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
  /**
   * Unused at launch: the client does not want a phone number published, so
   * nothing in the site renders this. Setting it has no effect until a
   * renderer is added back.
   */
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
 * One piece of press coverage, linking out to the article on the outlet's own
 * site. A document type rather than a field on a page: in Phase 2 these are
 * their own Sanity documents, queried and sorted, which is why the /press page
 * declares a `pressList` block and does not carry the items itself.
 */
export interface PressItem {
  _id: string;
  _type: 'pressItem';
  /** The publication, as it would want to be credited — 'KPCW — Mountain Money'. */
  outlet: string;
  headline: string;
  /**
   * ISO 8601: 'YYYY-MM-DD', or 'YYYY-MM' when the outlet dates a piece only to
   * the month. Both are valid and render differently — see PressList. Stored
   * as a string, never a Date: a Date would be parsed as UTC midnight and
   * render as the previous day in every timezone west of Greenwich, which is
   * all of them here.
   */
  date: string;
  /** Absolute URL on the outlet's own site. Always opens in a new tab. */
  url: string;
  excerpt?: string;
  /** The outlet's mark, where one is licensed for use. */
  logo?: SanityImage;
}

/**
 * RESERVED FOR THE PHASE 2 BLOG. Nothing renders this and no fixtures exist.
 *
 * Defined now so the shape is settled before the Sanity schema is written, and
 * so the footer's editorial group has a second member to plan for rather than
 * being built twice. When the blog is built this gains a route, a list page and
 * a `post` entry in the Block renderer's sibling switch; until then it is a
 * type and nothing else.
 *
 * `body` is Portable Text, like every other rich field on the site, so a post
 * renders through the same PortableText component the blocks use.
 */
export interface Post {
  _id: string;
  _type: 'post';
  title: string;
  /** URL segment, unique across posts. The route will be `/blog/<slug>`. */
  slug: string;
  /** ISO 8601 datetime. Full precision, unlike PressItem.date. */
  publishedAt: string;
  author: string;
  mainImage: SanityImage;
  body: PortableTextBlock[];
  /**
   * Free text for now. If the blog ships with a fixed set of categories this
   * becomes a string-literal union, the way every other authored choice on the
   * site is constrained.
   */
  category: string;
}

/**
 * Membership pricing.
 *
 * Amounts are numbers, not display strings, because founding memberships show a
 * monthly figure while billing annually up front and both have to render from
 * one source. The 'one kid' founding tier, "$140 a month, billed $1,680
 * annually, down from $150", is:
 *
 *   amount 140, interval 'month', compareAtAmount 150,
 *   billedAmount 1680, billedInterval 'year'
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

/**
 * Which section of the FAQ a question belongs to.
 *
 * 'safety' replaced 'accessibility', which nothing ever used: the questions
 * the client supplied are about grip socks, cleaning and illness, and filing
 * those under accessibility would have been wrong in a way that matters —
 * accessibility is a real commitment this site has not yet documented, and a
 * category named for it should hold questions about it.
 *
 * The section titles are authored in content/faqs.ts, not here: a category is
 * the key, its heading is copy.
 */
export type FaqCategory = 'visiting' | 'membership' | 'cafe' | 'parties' | 'safety';

/** One collapsible group of questions, assembled by lib/content.ts. */
export interface FaqSection {
  _key: string;
  title: string;
  /** Omitted leaves the heading in ink. Authored per section in content/faqs.ts. */
  titleColor?: ScriptHeadingColor;
  items: FaqItem[];
}

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
  /** At launch: the links inside the homepage's hamburger menu. */
  primaryNav: Link[];
  /**
   * The sub-page top bar's horizontal nav, as references to pages rather than
   * as hand-written links — see NavItem.
   *
   * A separate list from primaryNav: the two serve different pages and will
   * not stay in step. The top bar is where Visit, Memberships, Parties and
   * Cafe land as those pages are built, while the homepage panel stays short.
   */
  topNav?: NavItem[];
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
  /**
   * Optional, and the switch that decides whether this entry renders at all.
   *
   * An account can be staged here before its address exists — pick the
   * platform now, paste the url when it lands — and nothing appears in the
   * footer until it does. It used to render as a bare glyph in the meantime,
   * which looked like a link that did not work.
   *
   * Every platform in SocialPlatform already has a glyph and an accessible
   * name, so adding one is a content edit and nothing else.
   */
  url?: string;
  /** Accessible name; defaults to the platform name when absent. */
  label?: string;
}

export type SocialPlatform = 'instagram' | 'facebook' | 'x' | 'tiktok' | 'youtube';
