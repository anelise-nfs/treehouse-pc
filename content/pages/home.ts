import type { Page } from '@/types/content';
import { partyPackages } from '../parties';
import { parkCity } from '../location';
import { pt } from '../_portableText';
import { checkerboardDivider, contactCopy, earlyBirdPerks, foundingPricingTable } from './_shared';

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
        variant: 'solid-ocean',
      },
      scriptHeadline: 'climb higher, imagine bigger, play freely',
      mobileScriptHeadline: 'climb higher, play freely',
      bandColor: 'ocean',
      subhead: pt(
        "A playground for the kids. A cafe for you. Park City's one and only premium indoor play space for ages 0–12.",
      ),
      primaryCta: {
        label: 'reserve your membership now',
        kind: 'internal',
        href: '/early-bird',
        variant: 'outline-tangerine',
      },
    },
    {
      _key: 'built-for-play',
      _type: 'imageTextSplit',
      heading: 'built for play that matters',
      imageSide: 'left',
      image: {
        // PLACEHOLDER: final photography pending.
        url: '/images/play-slide.jpg',
        alt: 'A child-height wooden slide winding down from the upper level of the play structure',
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
      imageSide: 'right',
      image: {
        // PLACEHOLDER: final photography pending.
        url: '/images/toddler-zone.jpg',
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
      imageSide: 'left',
      image: {
        // PLACEHOLDER: final photography pending.
        url: '/images/cafe-coffee.jpg',
        alt: 'Two people passing a cup of coffee across a table',
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
    {
      _key: 'band-early-bird',
      _type: 'sectionBand',
      heading: 'early bird gets the worm',
      color: 'tangerine',
      level: 'secondary',
    },
    foundingPricingTable('founding-pricing'),
    {
      _key: 'founding-intro',
      _type: 'richText',
      align: 'center',
      content: pt(
        "Founding Members (aka early birds) are the families who believe in what we're building — and we're making it worth your while.",
      ),
    },
    earlyBirdPerks('early-bird-perks'),
    {
      _key: 'band-drop-in',
      _type: 'sectionBand',
      heading: 'drop-in play',
      color: 'lime',
      level: 'secondary',
    },
    {
      _key: 'drop-in-prices',
      _type: 'priceBadgeRow',
      badges: [
        { _key: 'little-kid', label: 'little kid', note: 'up to three', price: '$28', color: 'flamingo' },
        { _key: 'big-kid', label: 'big kid', note: 'four – twelve', price: '$35', color: 'ocean' },
        { _key: 'wee-ones', label: 'wee ones', note: 'under one', price: 'free with sibling', color: 'sunshine' },
      ],
    },
    {
      _key: 'drop-in-copy',
      _type: 'richText',
      align: 'center',
      content: pt(
        "Most days, you can just walk right in — no planning required. On our busiest days (think holidays, powder days, and peak tourist weeks), we use timed entry to keep things comfortable and never overcrowded, so you'll reserve an entry time in advance. We'll always make it easy to know before you go.",
        'Play sessions are come-and-stay — settle in, grab a snack, and let the kids explore.',
      ),
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
      intro: pt('three private rooms sized to fit your crew'),
      columns: 3,
      items: [
        {
          _key: 'the-nook',
          title: 'the nook',
          body: 'up to 16 kids',
          // PLACEHOLDER: room photography pending; mockups show grey boxes.
          image: { url: '/images/room-the-nook.jpg', alt: 'The Nook party room' },
        },
        {
          _key: 'the-den',
          title: 'the den',
          body: 'up to 24 kids',
          image: { url: '/images/room-the-den.jpg', alt: 'The Den party room' },
        },
        {
          _key: 'the-grove',
          title: 'the grove',
          body: 'up to 48 kids',
          image: { url: '/images/room-the-grove.jpg', alt: 'The Grove party room' },
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
      _key: 'location',
      _type: 'locationBlock',
      location: parkCity,
      showHours: true,
      showMap: true,
    },
    {
      _key: 'band-connect',
      _type: 'sectionBand',
      heading: 'connect with us',
      color: 'tomato',
      level: 'primary',
      anchorId: 'connect',
      accent: 'rainbow',
    },
    contactCopy('contact'),
    checkerboardDivider('footer-divider'),
  ],
};
