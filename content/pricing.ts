import type { Link, PricingTier } from '@/types/content';
import { rollerCheckout, rollerProductIds } from './checkout';

/**
 * A tier's purchase button: opens ROLLER's overlay on that tier's product.
 *
 * A factory rather than three hand-written Links, because everything except
 * the product id and the name in the accessible label is identical across the
 * three — and the one thing that must never be copy-pasted wrong is which
 * product id sits on which price.
 *
 * `kind: 'checkout'` makes this a trigger rather than a navigation; `href` is
 * the store it falls back to if the widget has not loaded. See
 * components/CheckoutTrigger.tsx.
 */
function joinNow(tierSlug: string, productId: string, buys: string): Link {
  return {
    label: 'join now',
    kind: 'checkout',
    href: rollerCheckout.checkoutUrl,
    checkout: {
      productId,
      triggerId: `checkout-join-now-${tierSlug}`,
      // The visible 'join now' is the client's copy and reads correctly under
      // a price. This is what it means away from that price.
      ariaLabel: `Join now — founding membership for ${buys}`,
    },
    // Outline, not solid: the price block directly above each of these is already
    // a saturated color field, and a filled button under it put two competing
    // blocks of color in a card about 360px wide. The outline reads as the card's
    // action without fighting the price for attention, and it fills solid blue on
    // hover, so the emphasis arrives when it is useful.
    variant: 'outline-ocean',
  };
}

/**
 * Founding ("early bird") memberships. The mockups show a monthly figure with
 * the standard rate struck through, but the customer is charged the full year
 * up front — hence the separate billed* fields, which the cards now spell out
 * ("$1,680 for the year") rather than leaving to the footnote alone.
 *
 * billedAmount is always amount × 12: 140 × 12 = 1680, 235 × 12 = 2820,
 * 330 × 12 = 3960. It is stored rather than computed because a future tier may
 * be billed on different terms, and because in Phase 2 it is an authored field.
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
    cta: joinNow('one-kid', rollerProductIds.oneKid, 'one child'),
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
    cta: joinNow('two-kids', rollerProductIds.twoKids, 'two children'),
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
    cta: joinNow('three-plus-kids', rollerProductIds.threePlusKids, 'three or more children'),
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
