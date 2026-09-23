import type { Page } from '@/types/content';
import { partyPackages } from '../parties';
import { parkCity } from '../location';
import { pt } from '../_portableText';
import { earlyBirdMembership } from './_shared';

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
      image: {
        // PLACEHOLDER: final photography pending.
        url: '/images/hero-play-structure.jpg',
        alt: 'The Treehouse play structure: wooden climbing towers, slides, and a vintage camper, with paper geese hanging from the ceiling',
      },
      overlayHeadline: "Park City's one and only indoor playground opening this winter!",
      overlayCta: {
        label: 'early bird pricing',
        kind: 'internal',
        href: '/early-bird',
        variant: 'solid-tangerine-white',
      },
      scriptHeadline: 'climb higher, imagine bigger, play freely',
      bandColor: 'mint',
      subhead: pt(
        "A playground for the kids. A cafe for you. Park City's one and only premium indoor play space for ages 0–12.",
      ),
      primaryCta: {
        label: 'reserve your membership now',
        kind: 'internal',
        href: '/early-bird',
        variant: 'solid-ocean',
      },
    },
    {
      _key: 'built-for-play',
      _type: 'imageTextSplit',
      heading: 'built for play that matters',
      headingColor: 'tomato',
      imageSide: 'left',
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
      _type: 'imageTextSplit',
      heading: 'clean, safe and thoughtfully designed',
      headingColor: 'ocean',
      imageSide: 'right',
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
      _key: 'band-keepers',
      _type: 'sectionBand',
      heading: 'for kids and their keepers',
      color: 'flamingo',
      level: 'primary',
      accent: 'flowers',
    },
    {
      _key: 'cafe',
      _type: 'imageTextSplit',
      heading: "a cafe you'll actually love",
      headingColor: 'pine',
      imageSide: 'left',
      image: {
        // PLACEHOLDER: the client has supplied no cafe image. Both the url and
        // the alt below change together when the real photograph arrives.
        url: '/images/placeholder-cafe.svg',
        alt: 'Placeholder graphic: cafe photography pending',
      },
      body: pt(
        'Good coffee, healthy snacks, comfortable seats – and a calm, beautiful space to gather, connect, and be present while the kids play.',
      ),
      accent: 'loop',
    },
    {
      _key: 'band-how-it-works',
      _type: 'sectionBand',
      heading: 'how it works',
      color: 'sky',
      level: 'primary',
      anchorId: 'how-it-works',
      accent: 'rainbow',
    },
    earlyBirdMembership('early-bird-membership'),
    {
      _key: 'drop-in',
      _type: 'dropInSection',
      title: 'drop-in play',
      titleBandColor: 'lime',
      badges: [
        {
          _key: 'little-kid',
          label: 'little kid',
          note: 'up to three',
          price: '$28',
          labelColor: 'seafoam',
          priceColor: 'flamingo',
        },
        {
          _key: 'big-kid',
          label: 'big kid',
          note: 'four – twelve',
          price: '$35',
          labelColor: 'ocean',
          priceColor: 'lime',
        },
        {
          _key: 'wee-ones',
          label: 'wee ones',
          note: 'under one',
          price: 'free',
          priceNote: 'with sibling',
          labelColor: 'sunshine',
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
      _type: 'sectionBand',
      heading: 'party with us',
      color: 'sunshine',
      level: 'primary',
      anchorId: 'parties',
    },
    {
      _key: 'party-intro',
      _type: 'richText',
      align: 'center',
      content: pt(
        "The easiest birthday you'll ever throw. Your party includes a private room for two full hours plus play access for all your little guests — so the kids climb, explore, and celebrate while you actually enjoy the day.",
      ),
      subcopy: pt(
        'Choose the level of help that fits your style: bring your own, or let us handle everything.',
      ),
    },
    {
      _key: 'party-packages',
      _type: 'partyPackages',
      packages: partyPackages,
      link: {
        label: 'get this party started',
        // PLACEHOLDER: routes to email until the ROLLER booking flow exists.
        kind: 'external',
        href: 'mailto:fontaine@treehouseparkcity.com?subject=Party%20inquiry',
        variant: 'solid-ocean',
      },
    },
    {
      _key: 'pick-your-room',
      _type: 'featureGrid',
      heading: 'pick your room',
      subheading: 'three private rooms sized to fit your crew',
      columns: 3,
      items: [
        {
          _key: 'the-nook',
          title: 'the nook',
          // PLACEHOLDER: room photography pending; all three share one stand-in.
          image: {
            url: '/images/placeholder-room.svg',
            alt: 'Placeholder graphic: photography of Nook pending',
          },
          caption: 'up to 16 kids',
        },
        {
          _key: 'the-den',
          title: 'the den',
          // PLACEHOLDER: room photography pending; all three share one stand-in.
          image: {
            url: '/images/placeholder-room.svg',
            alt: 'Placeholder graphic: photography of Den pending',
          },
          caption: 'up to 24 kids',
        },
        {
          _key: 'the-grove',
          title: 'the grove',
          // PLACEHOLDER: room photography pending; all three share one stand-in.
          image: {
            url: '/images/placeholder-room.svg',
            alt: 'Placeholder graphic: photography of Grove pending',
          },
          caption: 'up to 48 kids',
        },
      ],
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
