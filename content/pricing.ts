import type { Link, PricingTier } from '@/types/content';

const beAnEarlyBird: Link = {
  label: 'be an early bird',
  kind: 'internal',
  href: '/early-bird',
  variant: 'solid-ocean',
};

/**
 * Founding ("early bird") memberships. The mockups show a monthly figure with
 * the standard rate struck through, but the customer is charged the full year
 * up front — hence the separate billed* fields. 135 × 12 = 1620, and so on.
 *
 * No per-tier feature lists exist in the mockups; the shared perks list carries
 * that copy instead.
 */
export const foundingTiers: PricingTier[] = [
  {
    _id: 'pricingTier.founding-one-kid',
    _type: 'pricingTier',
    name: 'one kid',
    amount: 140,
    interval: 'month',
    // NOTE: every other tier's compareAtAmount equals the matching standard
    // rate below (250/250, 350/350). This one no longer does — standard 'one
    // kid' is still 145. Raise it to 150 when the standard rates are
    // confirmed, or the crossed-out price will contradict the real one.
    compareAtAmount: 150,
    billedAmount: 1620,
    billedInterval: 'year',
    features: [],
    headerColor: 'lime',
    // Ocean, not sky: the brighter blue, matching the 'big kid' drop-in badge
    // so the two blues on the page are the same blue. Both tiers named 'one
    // kid' carry it — the standard one does not render yet, and leaving it on
    // sky would have the pair diverge the day it does.
    priceColor: 'ocean',
    cta: beAnEarlyBird,
  },
  {
    _id: 'pricingTier.founding-two-kids',
    _type: 'pricingTier',
    name: 'two kids',
    amount: 235,
    interval: 'month',
    compareAtAmount: 250,
    billedAmount: 2820,
    billedInterval: 'year',
    features: [],
    headerColor: 'pine',
    priceColor: 'mint',
    cta: beAnEarlyBird,
  },
  {
    _id: 'pricingTier.founding-three-plus-kids',
    _type: 'pricingTier',
    name: 'three+ kids',
    amount: 330,
    interval: 'month',
    compareAtAmount: 350,
    billedAmount: 3960,
    billedInterval: 'year',
    features: [],
    headerColor: 'tangerine',
    priceColor: 'flamingo',
    cta: beAnEarlyBird,
  },
];

/**
 * Standard rates that take effect after opening. Not rendered by either launch
 * page — they are the `compareAtAmount` figures above — but they are the real
 * post-opening prices and belong in content rather than in a future commit.
 */
export const standardTiers: PricingTier[] = [
  {
    _id: 'pricingTier.standard-one-kid',
    _type: 'pricingTier',
    name: 'one kid',
    amount: 145,
    interval: 'month',
    features: [],
    headerColor: 'lime',
    // Ocean, not sky: the brighter blue, matching the 'big kid' drop-in badge
    // so the two blues on the page are the same blue. Both tiers named 'one
    // kid' carry it — the standard one does not render yet, and leaving it on
    // sky would have the pair diverge the day it does.
    priceColor: 'ocean',
  },
  {
    _id: 'pricingTier.standard-two-kids',
    _type: 'pricingTier',
    name: 'two kids',
    amount: 250,
    interval: 'month',
    features: [],
    headerColor: 'pine',
    priceColor: 'mint',
  },
  {
    _id: 'pricingTier.standard-three-plus-kids',
    _type: 'pricingTier',
    name: 'three+ kids',
    amount: 350,
    interval: 'month',
    features: [],
    headerColor: 'tangerine',
    priceColor: 'flamingo',
  },
];

export const pricingTiers: PricingTier[] = [...foundingTiers, ...standardTiers];
