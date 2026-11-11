import type { Page } from '@/types/content';
import { parkCity } from '../location';
import { pt } from '../_portableText';
import { foundingMembershipSection } from '../shared/foundingMembership';

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
  seo: {
    title: 'Treehouse — neighborhood play cafe in Park City, Utah',
    description:
      "A playground for the kids. A cafe for you. Park City's one and only premium indoor play space for ages 0–12.",
    noIndex: true,
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
      overlayHeadline: "Park City's one and only indoor playground opening this winter!",
      scriptHeadline: 'climb higher, imagine bigger, play freely',
      mobileScriptHeadline: 'climb higher, play freely',
      bandColor: 'mint',
      primaryCta: {
        label: 'reserve your membership now',
        kind: 'internal',
        href: '/early-bird',
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
        body: pt(
          'Treehouse is a gathering space — not just somewhere to drop in, but somewhere to belong. Our calendar stays full of classes, workshops, and activities that bring families back week after week, where neighbors become friends over coffee and kids find something new to love each visit. A living, breathing part of our community.',
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
      heading: 'for kids and their keepers',
      headingColor: 'pine',
      imageSide: 'right',
      image: {
        // PLACEHOLDER: the client has supplied no cafe image. Both the url and
        // the alt below change together when the real photograph arrives.
        url: '/images/placeholder-cafe.svg',
        alt: 'Placeholder graphic: cafe photography pending',
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
    foundingMembershipSection('early-bird-membership', {
      title: 'early bird gets the worm',
      titleBandColor: 'tangerine',
      anchorId: 'memberships',
      intro: pt(
        "Founding Members (aka early birds) are the families who believe in what we're building — and we're making it worth your while.",
      ),
    }),
    {
      _key: 'drop-in',
      _type: 'dropInSection',
      title: 'drop-in play',
      titleBandColor: 'lime',
      badges: [
        {
          _key: 'little-kid',
          label: 'little kid',
          note: 'up to age 3',
          price: '$28',
          labelColor: 'pine',
          priceColor: 'flamingo',
        },
        {
          _key: 'big-kid',
          label: 'big kid',
          note: 'ages 4–12',
          price: '$35',
          labelColor: 'ocean',
          priceColor: 'lime',
        },
        {
          _key: 'wee-ones',
          label: 'wee ones',
          note: 'under 1 free with a paying sibling',
          price: 'free',
          labelColor: 'tangerine',
          priceColor: 'sky',
        },
      ],
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
      // PLACEHOLDER COPY — awaiting client. The first paragraph is the only
      // line that survived from the two-package version; the price is a
      // stand-in.
      content: pt(
        "The easiest birthday you'll ever throw. Your party includes a private room for two full hours plus play access for all your little guests — so the kids climb, explore, and celebrate while you actually enjoy the day.",
        '$40 per child, with optional add-ons.',
      ),
      // subcopy, not a CTA: there is nothing to book yet, and this reads as a
      // note rather than an invitation to act.
      subcopy: pt('Parties will be available to book when we open this winter.'),
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
      decorations: [{ doodle: 'spiral', slot: 'top-right', color: 'sunshine' }],
      _type: 'locationBlock',
      location: {
        label: 'Treehouse Park City',
        address: '1209 Center Dr, Park City, UT 84098',
        // PLACEHOLDER: approximate. Confirm the exact pin before the map goes live.
        coordinates: { lat: 40.719, lng: -111.539 },
      },
      zoom: 15,
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
