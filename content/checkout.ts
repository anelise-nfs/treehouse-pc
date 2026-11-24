/**
 * ROLLER checkout configuration — every value that belongs to the ROLLER
 * account rather than to a page, in one file.
 *
 * ROLLER is the client's booking and ecommerce platform. Its checkout widget
 * loads a script that attaches a `RollerCheckout` global, and the purchase
 * buttons on this site call that global to open ROLLER's overlay over our own
 * page. Nothing is posted anywhere by us: the overlay owns the cart, the
 * payment and the receipt, which is why Phase 1 can sell memberships with no
 * database and no API routes.
 *
 * THESE IDS COME FROM ROLLER AND ARE NOT OURS TO INVENT. A product id is the
 * id of a product in the client's ROLLER back office. If a tier is rebuilt
 * there it gets a new id, and the button silently opens the wrong overlay or
 * none at all — so when prices change, check these too.
 *
 * In Phase 2 these become Sanity fields: `checkoutUrl` on site settings, and a
 * `productId` on each pricing tier document, so the client can wire a new tier
 * without a deploy.
 */
import type { CheckoutConfig } from '@/types/content';

export const rollerCheckout: CheckoutConfig = {
  /**
   * ROLLER's widget loader. It reads `data-checkout` off its own script tag to
   * learn which store to open — see components/CheckoutScript.tsx, which is
   * what renders the tag.
   */
  scriptSrc: 'https://cdn.rollerdigital.com/scripts/widget/checkout_iframe.js',
  /**
   * The early bird store. Also the `href` every purchase button carries, so a
   * click that cannot open the overlay — script still loading, script blocked,
   * JavaScript off — lands on the real store instead of doing nothing. See
   * components/CheckoutTrigger.tsx.
   */
  checkoutUrl: 'https://ecom.roller.app/treehouseparkcity/earlybird/en-us/home',
};

/**
 * The gift-card section, and the only ROLLER target left. EARLY_BIRD_SECTION
 * stood beside it pointing at the founding-membership range, and went with
 * that sale along with the per-tier product ids.
 *
 * SINGULAR, AND NOT A TYPO. ROLLER matches this against the section name in
 * the client's Products tab, which reads 'Gift Card'. Our own page title and
 * footer link read 'Gift Cards', because that is what a visitor calls them —
 * so the two deliberately disagree and pluralising this to match the page
 * breaks the overlay.
 */
export const GIFT_CARD_SECTION = 'Gift Card';
