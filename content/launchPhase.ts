/**
 * WHICH VERSION OF THE MEMBERSHIP SECTION THE SITE SERVES.
 *
 * Two versions are written and ready. Changing the one line below switches
 * every page between them — copy, buttons and purchase links together, so no
 * combination of half-updated content can ship.
 *
 *   'v1-a'  FIRST LAUNCH. Nothing is for sale yet: the reservation platform is
 *           not wired up. Both pages say memberships are coming and ask for an
 *           email address; the per-tier purchase buttons are absent.
 *
 *   'v1-b'  SECOND LAUNCH, about 24 hours later, once the ROLLER products are
 *           live. The purchase buttons appear on every tier, the copy says
 *           memberships are on sale, and the mailing-list ask steps back.
 *
 * WHAT MOVES BETWEEN THEM, and where:
 *
 *   /early-bird (content/pages/earlyBird.ts)
 *     intro 2nd paragraph  'will go on sale soon'  ->  'are on sale now'
 *     buttons under copy   'join the email club'   ->  none
 *
 *   homepage (content/pages/home.ts)
 *     intro                pitch + 'on sale soon'  ->  pitch alone
 *     buttons under copy   'learn more' + 'join the email club'
 *                                                  ->  'learn more' + 'be an early bird'
 *
 *   both pages (content/pricing.ts)
 *     per-tier button      absent                  ->  'join now' -> ROLLER
 *
 * REMAINING WORK FOR v1-b — two placeholder links, both of which only render
 * in v1-b, so neither can reach the live v1-a site:
 *
 *   PLACEHOLDER_CTA  (content/pricing.ts)              -> each tier's ROLLER product
 *   beAnEarlyBird    (content/shared/foundingMembership.ts) -> the product page
 *
 * Swap both before switching, or those buttons appear and go nowhere.
 *
 * In Phase 2 this file goes: every switch below is something a Sanity author
 * edits directly — the copy on each page, and whether a tier carries a CTA.
 */
export type LaunchPhase = 'v1-a' | 'v1-b';

/**
 * THE SWITCH. One line, one edit.
 *
 * The `as` is load-bearing: without it TypeScript narrows this const to the
 * literal 'v1-a' and then rejects the comparison below as unreachable, which
 * would make the file refuse to compile in exactly the state it ships in.
 */
export const LAUNCH_PHASE = 'v1-a' as LaunchPhase;

/**
 * Derived rather than tracked separately, so the sale copy and the purchase
 * buttons cannot disagree. Read this where the question is "is there something
 * to buy"; read LAUNCH_PHASE where the question is "which version is this".
 */
export const MEMBERSHIPS_ON_SALE = LAUNCH_PHASE === 'v1-b';
