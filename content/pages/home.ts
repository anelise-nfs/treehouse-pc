import type { Page } from '@/types/content';
import { parkCity } from '../location';
import { pt } from '../_portableText';
import {
  beAnEarlyBird,
  foundingMembershipSection,
  foundingPitch,
  joinTheEmailClub,
  learnMore,
  learnMoreSecondary,
  saleSoonLine,
} from '../shared/foundingMembership';
import { MEMBERSHIPS_ON_SALE } from '../launchPhase';
import { dropInBadges } from '../dropIn';

/**
 * Launch homepage. Copy is verbatim from to_start.png except where marked
 * PLACEHOLDER; the hero follows hero_redesign.png, which supersedes the header
 * treatment in to_start.png.
 *
 * Band colors alternate deliberately — the hero band is pine, and no two
 * adjacent bands repeat a color.
 */
export const homePage: Page = {
  _id: 'page.home',
  _type: 'page',
  title: 'Treehouse Park City',
  slug: '',
  // The overlay header belongs to this page alone: it is the only one that
  // opens on a full-bleed photograph for a transparent bar to sit on.
  headerVariant: 'overlay',
  seo: {
    title: 'Treehouse — neighborhood play cafe in Park City, Utah',
    description:
      "A playground for the kids. A cafe for you. Park City's one and only premium indoor play space for ages 0–12.",
  },
  location: parkCity,
  blocks: [
    {
      _key: 'hero',
      _type: 'hero',
      // No decorations: both previous placements landed on the photograph, and
      // the hero now positions its own marks against the seam. The field still
      // works if any are wanted back.
      image: {
        // PLACEHOLDER: final photography pending.
        url: '/images/hero-play-structure.jpg',
        alt: 'The Treehouse play structure: wooden climbing towers, slides, and a vintage camper, with paper geese hanging from the ceiling',
      },
      overlayHeadline: "Park City's one and only neighborhood play cafe — opening this winter",
      scriptHeadline: 'for kids and their keepers',
      // No mobileScriptHeadline: it existed to shorten a three-line headline on
      // a phone, and this one is five words. Setting one now would show
      // different copy at different widths for no reason.
      bandColor: 'mint',
      // LAUNCH WORDING. Founding memberships are not on sale yet, so the hero
      // asks for an email instead of a purchase and points at the footer's
      // opt-in. At sales launch this flips to:
      //
      //   label: 'learn about memberships'
      //   kind:  'internal'
      //   href:  '/early-bird'
      //
      // and nothing else about the hero changes.
      primaryCta: {
        label: 'sign up for updates',
        // Opens the signup dialog rather than scrolling. This is the only
        // call to action a first visitor sees, and anchoring it sent them
        // nine screens down the page, past everything, to the footer.
        kind: 'newsletter',
        href: '#newsletter',
        variant: 'solid-ocean',
      },
      // Rendered by the hero, not as a block of its own: its seam continues the
      // hero's curve. PLACEHOLDER copy pending the client's.
      afterBand: {
        heading: 'more than a playground',
        color: 'mint',
        image: {
          url: '/graphics/treering.png',
          alt: '',
        },
        // Two paragraphs, so the closing line lands on its own. The band's
        // PortableText sets a top margin on every paragraph it renders, so the
        // second is spaced from the first without anything else changing.
        body: pt(
          'Treehouse is a gathering space — not just somewhere to drop in, but somewhere to belong. Our calendar stays full of classes, workshops, and activities that bring families back week after week, where neighbors become friends over coffee and kids find something new to love each visit. A living, breathing part of our community.',
          "We can't wait to see you!",
        ),
      },
    },
    {
      _key: 'built-for-play',
      // bleed, not a smaller size: at sm the stars shrank to 34px against the
      // squiggle's 102px. md matches it, and lifting past the block's top edge
      // is what keeps them off the vertically centred copy.
      decorations: [{ doodle: '3stars', slot: 'top-left', color: 'sunshine', bleed: true }],
      _type: 'imageTextSplit',
      heading: 'built for play that matters',
      headingColor: 'tomato',
      imageSide: 'right',
      image: {
        // Client render, not photography. Final photography still pending.
        url: '/images/playarea_view4.png',
        alt: 'The play floor: linked wooden treehouses over artificial grass, with a climbing wall, a tube slide, and paper geese hanging from the ceiling',
      },
      body: pt(
        'Every slide, nook, and climbing structure is thoughtfully designed to grow with your child and support real development: building strength and balance, fine-tuning little hands, sparking imagination, and learning to play together — screen-free, always.',
      ),
      accent: 'squiggle',
    },
    {
      _key: 'clean-safe-designed',
      // Doodle on the right: the image sits left in this block, and a
      // bottom-left mark landed on the photograph.
      decorations: [{ doodle: 'squiggle', slot: 'bottom-right', color: 'tangerine', size: 'lg' }],
      _type: 'imageTextSplit',
      heading: 'clean, safe and thoughtfully designed',
      headingColor: 'ocean',
      imageSide: 'left',
      image: {
        // Client render, not photography. Final photography still pending.
        url: '/images/playarea_detail.png',
        alt: 'The toddler zone, with a soft mushroom house, a deer cubby, and a miniature camper',
      },
      body: pt(
        "We sweat the details so you don't have to: spotless spaces, age-appropriate zones, and equipment built and maintained to the highest safety standards — designed for you and your child to enjoy together.",
      ),
      accent: 'squiggle',
    },
    {
      _key: 'cafe',
      anchorId: 'cafe',
      // Top-left, on the text side, since the image sits right in this block.
      // A cup rather than a repeat of the stars, which moved to the first.
      //
      // Top rather than bottom because the cup's artwork is tall — 142px at the
      // default size — and this block's copy leaves only 114px beneath it, so
      // it crossed the last line however far it bled. There is more room above
      // the copy than below it.
      decorations: [{ doodle: 'coffee', slot: 'top-left', color: 'mint', bleed: true }],
      _type: 'imageTextSplit',
      // Carries the headline the removed sectionBand used to. The anchor stays
      // 'cafe' — the footer links to it and the copy is still about the cafe.
      heading: 'not just for kids',
      headingColor: 'pine',
      imageSide: 'right',
      image: {
        // Client-supplied stock, not final Treehouse photography — the filename
        // says so and ARCHITECTURE.md -> Placeholders still counts the cafe as
        // unshot. A real photograph replaces the three fields below together.
        url: '/images/TPC_cafe-stock-image.jpg',
        alt: 'Two hands holding dark ceramic cups over a cafe table — a latte with a leaf poured into the foam, and a black coffee',
        // Sanity's hotspot shape: x/y are the focal point and width/height the
        // region around it, all as fractions of the source. The region below
        // spans x 0.21-0.76 and y 0.21-0.96, which is both cups and the hands
        // holding them.
        //
        // The source is 3:2 and the block crops to 4:3 at every breakpoint, so
        // the crop only ever takes slivers off the left and right — about 5.5%
        // per side. x sits just left of centre to hold the latte cup, which is
        // the subject. y is inert in this container, authored honestly in case
        // another block ever crops this image vertically.
        hotspot: { x: 0.48, y: 0.58, width: 0.55, height: 0.75 },
        width: 1600,
        height: 1067,
      },
      body: pt(
        "A cafe you'll actually love with good coffee, healthy snacks, comfortable seats – and a calm, beautiful space to gather, connect, and be present while the kids play.",
      ),
      accent: 'loop',
    },
    {
      _key: 'band-how-it-works',
      decorations: [
        // Was flamingo, which the band now is: a pink mark on a pink fill came
        // to 1.33:1 and all but vanished. Seafoam is the lightest option
        // against it at 2.10:1.
        { doodle: 'rainbow', slot: 'top-left', color: 'seafoam', size: 'lg' },
        { doodle: 'm-squig', slot: 'bottom-right', color: 'sunshine', size: 'lg', bleed: true },
      ],
      _type: 'sectionBand',
      heading: 'how it works',
      color: 'flamingo',
      level: 'primary',
      anchorId: 'how-it-works',
      accent: 'rainbow',
    },
    {
      // Lifted out of the membership section's own intro so it sits directly
      // under the 'how it works' band, where it now introduces everything
      // below rather than just the prices — and so that band is no longer a
      // bare heading running straight into a second heading.
      //
      // A block of its own rather than the band's `body` field: SectionBand
      // renders body copy in white at --text-body, which on flamingo is
      // 3.11:1 against a 4.5:1 requirement. Nothing uses that field today, so
      // the trap is latent; on the page background this is ink on linen at
      // 16.78:1. See ARCHITECTURE.md -> Color rule.
      //
      // No doodle: the band above carries two and the membership section below
      // carries its own.
      _key: 'membership-intro',
      _type: 'richText',
      align: 'center',
      content: pt(foundingPitch),
    },
    foundingMembershipSection('early-bird-membership', {
      title: 'memberships',
      titleBandColor: 'tangerine',
      anchorId: 'memberships',
      // Just the sale-status line now, sitting immediately above the buttons
      // it refers to — the standing pitch moved up to the block above. v1-b
      // leaves this empty: by then the prices carry their own purchase
      // buttons and the status is self-evident. An empty intro renders
      // nothing, so the section opens on its title bar.
      intro: MEMBERSHIPS_ON_SALE ? pt() : pt(saleSoonLine),
      // Both buttons swap between versions, and which one gets the solid
      // treatment swaps with them. v1-a has nothing to sell, so 'learn more'
      // leads and the mailing list is the fallback. v1-b has a product page,
      // so that takes the primary slot and 'learn more' steps back — the
      // button that leads to a purchase should not be the quieter of the two.
      cta: MEMBERSHIPS_ON_SALE ? beAnEarlyBird : learnMore,
      secondaryCta: MEMBERSHIPS_ON_SALE ? learnMoreSecondary : joinTheEmailClub,
    }),
    {
      _key: 'drop-in',
      _type: 'dropInSection',
      title: 'drop-in play',
      titleBandColor: 'lime',
      badges: dropInBadges,
      body: pt(
        "Most days, you can just walk right in — no planning required. On our busiest days (think holidays, powder days, and peak tourist weeks), we use timed entry to keep things comfortable and never overcrowded, so you'll reserve an entry time in advance. We'll always make it easy to know before you go.",
      ),
      footnote:
        'Play sessions are come-and-stay — settle in, grab a snack, and let the kids explore.',
    },
    {
      _key: 'band-parties',
      decorations: [
        { doodle: 'squiggle-diagonal', slot: 'top-right', color: 'ocean', bleed: true },
      ],
      _type: 'sectionBand',
      heading: 'party with us',
      color: 'mint',
      level: 'primary',
      anchorId: 'parties',
    },
    // One party, described once. There were two named packages and a grid of
    // three rooms above this; both are gone. ROLLER assigns the room by party
    // size, so the room was never a guest's choice to make, and the packages
    // collapsed into a single party type.
    //
    // A richText block rather than the partyPackages block that used to sit
    // here: with one unnamed party there is no card grid left to render, and
    // no booking action at launch means no CTA either. The partyPackages block
    // type is still wired into the renderer if Phase 2 brings tiers back.
    {
      _key: 'party-intro',
      decorations: [{ doodle: 'butterfly', slot: 'left', color: 'flamingo' }],
      _type: 'richText',
      align: 'center',
      // PLACEHOLDER COPY — awaiting client. The surviving line from the
      // two-package version. The stand-in price that sat under it is gone;
      // no party pricing appears on the site now.
      content: pt(
        "The easiest birthday you'll ever throw. Your party includes a private room for two full hours plus play access for all your little guests — so the kids climb, explore, and celebrate while you actually enjoy the day.",
      ),
      // subcopy, not a CTA: there is nothing to book yet, and this reads as a
      // note rather than an invitation to act.
      subcopy: pt('Parties will be available to book when we open this winter.'),
    },
    {
      _key: 'band-grow-with-us',
      // Leaf for a section about growing, and the only mark in this section:
      // 'come see us' below carries none either, and the page had started to
      // accumulate doodles faster than copy.
      //
      // bleed, matching the m-squig on the 'how it works' band: a bottom slot
      // with bleed hangs the mark 32px past the band's edge, so it crosses the
      // fill onto the page below instead of sitting tidily inside a corner.
      //
      // 'sm', where that band uses 'lg', because the size step sets *width*
      // and the leaf's artwork is 35 x 58 — half again as tall as it is wide,
      // where a squiggle or a rainbow is flat. At 'sm' it is 96 x 159 against
      // a band about 150px tall, so roughly four fifths sits on the fill and
      // the rest hangs below. At 'md' it would overhang the top edge as well
      // and stop reading as a mark on the band at all.
      //
      // Seafoam on ocean reads at 2.40:1. Doodles carry no information and no
      // text sits on them, so WCAG does not apply — this is about the mark
      // being visible at all, the way flamingo-on-flamingo was not.
      decorations: [
        { doodle: 'leaf', slot: 'bottom-right', color: 'seafoam', size: 'sm', bleed: true },
      ],
      _type: 'sectionBand',
      heading: 'grow with us',
      // Ocean: the bands either side of this are mint and pine, and no two
      // adjacent bands repeat a colour. White on ocean is 3.56:1, which the
      // script heading clears as large text. It is also the only blue band on
      // the page, so the section reads as its own thing rather than an
      // extension of the parties above it.
      color: 'ocean',
      level: 'primary',
      anchorId: 'classes',
    },
    {
      _key: 'grow-intro',
      _type: 'richText',
      align: 'center',
      content: pt(
        "There's always something happening at Treehouse. Classes and workshops in music, movement, art, STEM, sewing, and crafting give kids the chance to try something new and find their people — plus seasonal events and community gatherings all year round. Something for every kind of kid, every season.",
      ),
      // subcopy, matching the party block above: a note about what is not
      // available yet, set smaller and muted rather than as body copy.
      subcopy: pt('Our full schedule will be released closer to opening this winter.'),
      // Unlike the party block, this one does have something to act on — the
      // mailing list is how someone hears when the schedule lands. Opens the
      // signup dialog like the hero's button; the href is the no-JavaScript
      // fallback to the footer's form.
      cta: {
        label: 'sign up for email updates',
        kind: 'newsletter',
        href: '#newsletter',
        variant: 'solid-ocean',
      },
    },
    {
      _key: 'band-come-see-us',
      _type: 'sectionBand',
      heading: 'come see us',
      color: 'pine',
      level: 'primary',
      anchorId: 'visit',
      accent: 'ribbon',
    },
    {
      _key: 'location-map',
      // No decoration: this block renders a real map now, and a doodle over
      // map tiles reads as a rendering fault rather than as atmosphere.
      _type: 'locationBlock',
      location: {
        label: 'Treehouse Park City',
        address: '1209 Center Dr, Park City, UT 84098',
        // UNUSED, and approximate. The map geocodes `address` above — the same
        // string the directions link uses — so nothing reads these numbers and
        // they have never been verified. Delete or correct them at the next
        // content review; leaving them risks someone trusting them later.
        coordinates: { lat: 40.719, lng: -111.539 },
      },
      // Desktop framing, one step wider than it started: at 15 and tighter the
      // surroundings stop reading as Park City. The phone crop derives its own
      // tighter zoom from this — see LocationMap.
      zoom: 14,
    },
    {
      _key: 'hours-address',
      _type: 'hoursAddress',
      // location is resolved from SiteSettings by /lib/content.ts.
    },
    // The 'connect with us' band and its contact copy moved into the site
    // footer, which renders on every route from app/layout.tsx.
  ],
};
