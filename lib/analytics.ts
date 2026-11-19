/**
 * Analytics events, pushed to the GTM data layer.
 *
 * GA4 is configured inside the GTM container, not in this codebase. Nothing
 * here loads a tag, sets up a property or calls gtag — it only puts an event
 * on the queue that GTM is already listening to. Adding gtag.js or
 * <GoogleAnalytics /> alongside it would double-count every pageview.
 *
 * Safe to call from anywhere. On the server, during prerender, and in any
 * browser where GTM has not loaded — blocked, offline, or simply not the
 * production deployment — this does nothing rather than throwing. A missing
 * analytics event must never be able to break a form submit.
 */

declare global {
  interface Window {
    /**
     * Created by the GTM snippet. Typed as unknown[] rather than a specific
     * shape because GTM accepts arbitrary objects and the container, not this
     * file, decides what the fields mean.
     */
    dataLayer?: unknown[];
  }
}

/**
 * Push a named event to the data layer.
 *
 * `event` is the key GTM matches a trigger on; everything in `params` rides
 * along as event parameters. Both are shaped by the container's configuration,
 * so a new event needs a matching trigger in GTM before it does anything.
 *
 * Usage, once the founding-membership form is wired up:
 *
 *   import { trackEvent } from '@/lib/analytics';
 *   trackEvent('founding_member_signup', { tier: 'two kids' });
 *
 * Nothing calls this yet, by design.
 */
export function trackEvent(event: string, params?: Record<string, unknown>): void {
  // Server render and prerender both reach this; neither has a window.
  if (typeof window === 'undefined') return;

  // Optional chaining, not a `push` on a lazily-created array: if GTM has not
  // loaded there is nothing to flush the queue later, so an event pushed now
  // would sit in memory until the page unloaded. Dropping it is honest.
  window.dataLayer?.push({ event, ...params });
}
