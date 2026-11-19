/**
 * Shared form helpers: email validation and the honeypot.
 *
 * NOT a submit path. This file used to hold one, plus a FORM_ENDPOINT for the
 * contact form, and both went when that form was removed from the site — the
 * only thing that posted to an endpoint. The two helpers left are about forms
 * in general rather than about any destination, which is why they outlived it.
 *
 * The one form still standing is the newsletter opt-in, and it subscribes over
 * JSONP from lib/mailchimp.ts: Mailchimp sends no CORS headers, so a
 * cross-origin fetch never leaves the browser. There is no server to post to
 * either way — every page here is prerendered at build time.
 *
 * If a contact form comes back, it needs its own endpoint and its own submit,
 * not a share of the newsletter's. The two have different recipients,
 * different retention and different consent: someone asking a question has not
 * subscribed to anything. Do not collapse them.
 */

/**
 * Name of the hidden field that bots fill in and people never see.
 *
 * A honeypot rather than a CAPTCHA: no third-party script, no dependency, and
 * nothing for a screen-reader user to solve. The field is hidden from assistive
 * tech and taken out of the tab order, so a human cannot reach it by accident;
 * anything arriving with it filled is dropped before it is sent.
 *
 * This is the site's own guard, checked in the browser. Mailchimp's separate
 * honeypot — a field named after the account and list ids — is sent empty by
 * lib/mailchimp.ts and enforced on their side.
 */
export const HONEYPOT_FIELD = 'company';

export type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Deliberately permissive: one @, something either side, a dot in the domain.
 *
 * Stricter patterns reject addresses that are perfectly valid — new TLDs,
 * plus-addressing, apostrophes — and the only authority on whether an address
 * works is whether mail to it arrives. This catches typos, which is all
 * client-side validation can honestly claim to do.
 */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
