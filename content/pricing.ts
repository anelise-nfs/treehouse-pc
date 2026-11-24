import type { PricingTier } from '@/types/content';

/**
 * Founding ("early bird") memberships. SOLD OUT, AND NO LONGER RENDERED.
 *
 * Kept as the record of what was actually sold — the rates, the annual totals
 * and the struck-through comparisons these families bought against. Their
 * ROLLER purchase buttons have been REMOVED rather than left dormant: those
 * products are closed, and a `cta` sitting on a sold-out tier is a button
 * waiting to be rendered by mistake. The product ids went with them, out of
 * content/checkout.ts.
 *
 * The homepage renders `standardTiers` below. Nothing renders these.
 *
 * billedAmount is always amount × 12: 140 × 12 = 1680, 235 × 12 = 2820,
 * 330 × 12 = 3960.
 */
export const foundingTiers: PricingTier[] = [
  {
    _id: 'pricingTier.founding-one-kid',
    _type: 'pricingTier',
    name: 'one kid',
    amount: 140,
    interval: 'month',
    compareAtAmount: 150,
    billedAmount: 1680,
    billedInterval: 'year',
    features: [],
    headerColor: 'lime',
    // Ocean, not sky: the brighter blue, matching the 'big kid' drop-in badge
    // so the two blues on the page are the same blue. Both tiers named 'one
    // kid' carry it — the standard one does not render yet, and leaving it on
    // sky would have the pair diverge the day it does.
    priceColor: 'ocean',
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
  },
];

/**
 * Standard rates that take effect at opening, and WHAT THE HOMEPAGE NOW
 * RENDERS. These were written as the `compareAtAmount` figures the founding
 * cards struck through; with that sale closed they are simply the prices.
 *
 * No compareAtAmount, no billedAmount and no cta, which is exactly the card
 * the change-over calls for: '$150/month' and nothing else. A standard
 * membership can be paid annually or monthly (see the FAQ), so there is no one
 * annual total to print, and there is nothing to buy until the doors open.
 */
export const standardTiers: PricingTier[] = [
  {
    _id: 'pricingTier.standard-one-kid',
    _type: 'pricingTier',
    name: 'one kid',
    // 150, matching the struck price on the founding tier above. It read 145
    // while the standard rates were unconfirmed, which made the crossed-out
    // $150 a discount off a number that appeared nowhere.
    amount: 150,
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
