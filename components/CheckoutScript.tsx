import Script from 'next/script';
import type { CheckoutConfig } from '@/types/content';

/**
 * Fixed, and the reason this component can be rendered from more than one
 * route without loading ROLLER twice: next/script dedupes by id, so a second
 * instance with this id is a no-op rather than a second network request and a
 * second global.
 */
export const CHECKOUT_SCRIPT_ID = 'roller-checkout';

/**
 * Loads ROLLER's checkout widget.
 *
 * One component, rendered by every route that has something to buy — the
 * homepage, /early-bird and /gift-cards. Not the root layout: the other seven
 * routes sell nothing, and a third-party script on a privacy policy is a
 * dependency nobody is getting anything for.
 *
 * `afterInteractive` rather than `beforeInteractive`: the overlay cannot be
 * opened until someone clicks a button, so there is nothing to gain from
 * blocking first paint on it, and the buttons degrade to a real link to the
 * store while it is in flight (see CheckoutTrigger).
 *
 * `data-checkout` is how ROLLER's loader learns which store to open — it reads
 * the attribute off its own tag. That is also why the URL is a prop rather
 * than a literal here: it is account configuration, so it lives in the content
 * layer with the product ids and reaches this component through
 * lib/content.ts. See ARCHITECTURE.md → Prime directive.
 */
export function CheckoutScript({ scriptSrc, checkoutUrl }: CheckoutConfig) {
  return (
    <Script
      id={CHECKOUT_SCRIPT_ID}
      src={scriptSrc}
      data-checkout={checkoutUrl}
      strategy="afterInteractive"
    />
  );
}
