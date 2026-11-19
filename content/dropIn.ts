import type { PriceBadge } from "@/types/content";

/**
 * Drop-in prices, in one place.
 *
 * Lifted out of the homepage block so the FAQ can quote the same figures
 * rather than restating them: two copies of a price is one copy that goes
 * stale, and the FAQ is exactly where someone checks a number before they
 * drive over. The homepage renders these as badges; content/faqs.ts reads the
 * prices out of the same array as prose.
 *
 * In Phase 2 these become their own Sanity documents and both readers query
 * them, which is the same relationship in a different store.
 */
export const dropInBadges: PriceBadge[] = [
  {
    _key: "little-kid",
    label: "little kid",
    note: "up to age 3",
    price: "$28",
    labelColor: "pine",
    priceColor: "flamingo",
  },
  {
    _key: "big-kid",
    label: "big kid",
    note: "ages 4–12",
    price: "$35",
    labelColor: "ocean",
    priceColor: "lime",
  },
  {
    _key: "wee-ones",
    label: "wee one",
    note: "under 1 free with a paying sibling",
    price: "free",
    labelColor: "flamingo",
    // UNUSED since the badge became an outlined circle — the ring and
    // label both take labelColor above. Left in place rather than
    // deleted from one badge of three; see PriceBadge.
    priceColor: "mint",
  },
];
