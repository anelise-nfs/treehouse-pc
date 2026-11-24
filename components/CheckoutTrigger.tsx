'use client';

import type { CheckoutTarget } from '@/types/content';

export interface CheckoutTriggerProps {
  target: CheckoutTarget;
  /** The ROLLER store, and the fallback if the overlay cannot open. */
  href: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Opens ROLLER's checkout overlay.
 *
 * An anchor to the real store, not a button, with the overlay layered on top —
 * the same arrangement as NewsletterTrigger, and for the same reason. The
 * destination is a real page, so without JavaScript the click still sells a
 * membership. Modifier- and middle-clicks fall through untouched, so "open in
 * new tab" behaves the way a link should.
 *
 * THE GUARD IS WHY THE ORDER HERE MATTERS. `preventDefault` runs only after
 * the global has been found, so a click that arrives before ROLLER's script
 * has finished loading navigates to the store instead of being swallowed. A
 * bare `window.RollerCheckout?.show()` typechecks and never throws, but it
 * turns that same click into a dead button — the failure mode that looks like
 * a broken site and reports as nothing at all.
 *
 * The fallback lands on the store's home rather than on the specific product,
 * which is a real difference for the per-tier buttons. It is the most that is
 * available without the widget, and better than a click that does nothing.
 */
export function CheckoutTrigger({ target, href, className = '', children }: CheckoutTriggerProps) {
  return (
    <a
      // Authored, not derived from the label: analytics reports on this, so it
      // has to survive someone rewording the button.
      id={target.triggerId}
      // All three tier buttons read 'join now'. The visible text is the
      // client's and is right in context — the price is directly above it —
      // but out of context, which is how a screen reader's element list
      // presents it, three identical links are a coin toss. This names the
      // tier each one buys.
      aria-label={target.ariaLabel}
      href={href}
      className={className}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        const checkout = window.RollerCheckout;

        if (!checkout) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(
              `[checkout] RollerCheckout is not on window yet; "${target.triggerId}" ` +
                'fell through to the store URL. Expected only before the script loads.',
            );
          }
          return;
        }

        event.preventDefault();

        // Spread rather than passed whole: `show` is ROLLER's, and handing it
        // an explicit `productId: undefined` is not the same as omitting the
        // key for every library that branches on `in`.
        checkout.show({
          ...(target.productId ? { productId: target.productId } : {}),
          ...(target.section ? { section: target.section } : {}),
        });
      }}
    >
      {children}
    </a>
  );
}
