/**
 * Form endpoints and the shared submit path.
 *
 * There is no server. Every page is prerendered at build time, so a form cannot
 * POST to this app — it posts to a third-party handler that receives the fields
 * and forwards them. Both constants below are those handlers, and both are
 * unset.
 *
 * The two flows are deliberately separate and must stay that way. The contact
 * form emails the business; the newsletter opt-in adds an address to a mailing
 * list. They have different recipients, different retention, and different
 * consent — someone asking a question has not subscribed to anything. Do not
 * collapse them onto one endpoint.
 */

/**
 * PLACEHOLDER — not yet configured. Fill this in with the contact form's
 * handler URL.
 *
 * Any handler that accepts a cross-origin POST of multipart form data works:
 * Formspree (`https://formspree.io/f/<id>`), Basin, Web3Forms, or a Netlify
 * form endpoint. The form sends `name`, `email` and `message`, plus the honeypot
 * field below, and asks for JSON back.
 *
 * Until this is set, submitting shows the "not connected" error state rather
 * than silently appearing to succeed. Nothing is sent anywhere.
 */
export const FORM_ENDPOINT = '';

/**
 * PLACEHOLDER — not yet configured. The client has not set up Mailchimp.
 *
 * Mailchimp's embedded-form action URL looks like
 * `https://<account>.us1.list-manage.com/subscribe/post?u=<u>&id=<id>`, which
 * does not accept a cross-origin fetch — it expects a real form POST and
 * answers with HTML. Two ways to land this when the account exists:
 *
 *   - point this at a thin relay (Formspree, Zapier catch hook, a Netlify or
 *     Vercel function) that calls Mailchimp's API server-side, which is what
 *     the code below assumes; or
 *   - swap the component's submit for a native form POST to the list-manage
 *     URL with `target="_blank"`, losing the inline success state.
 *
 * The first keeps the UI as built. Until this is set, submitting shows the
 * "not connected" error state. Nothing is sent anywhere.
 */
export const MAILCHIMP_ENDPOINT = '';

/**
 * Name of the hidden field that bots fill in and people never see.
 *
 * A honeypot rather than a CAPTCHA: no third-party script, no dependency, and
 * nothing for a screen-reader user to solve. The field is hidden from assistive
 * tech and taken out of the tab order, so a human cannot reach it by accident;
 * anything arriving with it filled is dropped before it is sent.
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

export interface SubmitResult {
  ok: boolean;
  /** Shown to the person verbatim when `ok` is false. */
  message?: string;
}

const NOT_CONFIGURED =
  "This form isn't connected yet. Please email us directly and we'll get right back to you.";

const FAILED = 'Something went wrong sending that. Please try again, or email us directly.';

/**
 * Posts a form to one of the endpoints above.
 *
 * multipart/form-data via FormData, not JSON: a JSON body sets a
 * Content-Type that is not CORS-safelisted and triggers a preflight, which
 * several of these handlers do not answer. FormData keeps it a simple request.
 * `Accept` is safelisted, so asking for JSON back costs nothing.
 *
 * Returns a result rather than throwing. A failed submit is an expected state
 * of this UI, not an exception.
 */
export async function submitForm(
  endpoint: string,
  fields: Record<string, string>,
): Promise<SubmitResult> {
  if (!endpoint) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[forms] Submit blocked: no endpoint configured. See lib/forms.ts.');
    }
    return { ok: false, message: NOT_CONFIGURED };
  }

  const body = new FormData();
  for (const [key, value] of Object.entries(fields)) body.append(key, value);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body,
      headers: { Accept: 'application/json' },
    });

    return response.ok ? { ok: true } : { ok: false, message: FAILED };
  } catch {
    // Network error, blocked request, or the handler rejecting the origin.
    return { ok: false, message: FAILED };
  }
}
