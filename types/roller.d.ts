/**
 * ROLLER's checkout widget, as it appears on `window`.
 *
 * Hand-written because ROLLER ships no types. This describes only the two
 * methods this site calls, not their whole surface — a narrow declaration that
 * is accurate beats a wide one that guesses.
 *
 * OPTIONAL ON PURPOSE. The global does not exist until ROLLER's script has
 * loaded and run, so every call site has to cope with it being absent. Marking
 * it `?` is what makes TypeScript insist on that rather than letting a bare
 * `window.RollerCheckout.show()` typecheck and then throw on a fast click.
 * See components/CheckoutTrigger.tsx for the guard.
 */

/** Which thing the overlay opens on. Exactly one of these is set. */
export interface RollerCheckoutOptions {
  /** A single ROLLER product — one founding tier. */
  productId?: string;
  /** A named section of the store, which lands on the range rather than a product. */
  section?: string;
}

export interface RollerCheckoutApi {
  /** Opens the overlay. With no options it opens the store's home. */
  show(options?: RollerCheckoutOptions): void;
  /**
   * Repoints the widget at a different store after load. Unused here — the
   * store is set declaratively through the script tag's `data-checkout` — but
   * declared because it is the other half of the documented API and the next
   * person should not have to guess whether it exists.
   */
  setCheckoutUrl(url: string): void;
}

declare global {
  interface Window {
    RollerCheckout?: RollerCheckoutApi;
  }
}
