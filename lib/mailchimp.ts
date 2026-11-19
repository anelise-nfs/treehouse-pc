/**
 * Mailchimp list subscription, over JSONP.
 *
 * WHY JSONP, in 2026: this site is prerendered and has no server, and
 * Mailchimp's subscribe endpoints send no CORS headers — a `fetch` from the
 * browser is blocked before it leaves. JSONP predates CORS and sidesteps it by
 * loading the response as a script, which is the approach Mailchimp's own
 * embedded form uses and the only one that works without standing up a relay.
 * If this site ever gains a server, the right move is Mailchimp's REST API
 * behind a route handler with a real API key, and this file goes.
 *
 * The values below are NOT secrets. They are the public embed parameters from
 * Mailchimp's own signup form — the same ones that would sit in plain sight in
 * the HTML of an embedded form, and all they permit is adding an address to
 * one list. A real API key would never belong in client code.
 */

/**
 * Public embed configuration for the one list this site subscribes to.
 *
 * `dc` is the account's data centre. It is already baked into `postJsonBase`
 * as the host's subdomain; it is named separately because that is how
 * Mailchimp's own documentation labels it, and because anyone checking these
 * against the Mailchimp dashboard will be looking for it.
 */
export const MAILCHIMP = {
  dc: 'us12',
  u: 'dc8726c309365918e28cbd047',
  id: '085e4e1c25',
  /**
   * Mailchimp's own honeypot. The field name encodes the account and list ids,
   * and Mailchimp drops any submission that arrives with it filled — so it is
   * always sent empty, which is what a real person's browser would send.
   */
  honeypotField: 'b_dc8726c309365918e28cbd047_085e4e1c25',
  /**
   * The `post-json` variant, not `post`. `post` answers with an HTML page
   * meant for a browser navigation; `post-json` answers with a JSONP callback
   * wrapping `{ result, msg }`, which is the only form that is useful here.
   */
  postJsonBase: 'https://treehouseparkcity.us12.list-manage.com/subscribe/post-json',
} as const;

/** Long enough for a slow phone on bad hotel wifi, short enough to not look hung. */
const TIMEOUT_MS = 10_000;

/** What Mailchimp hands back. `msg` may contain HTML — see `subscribe`. */
interface MailchimpResponse {
  result: 'success' | 'error' | string;
  msg: string;
}

export type SubscribeStatus = 'success' | 'already' | 'error';

export interface SubscribeResult {
  status: SubscribeStatus;
  /** Safe to render. Always our copy, never Mailchimp's — see `subscribe`. */
  message: string;
}

const MESSAGES = {
  success: 'You’re on the list — thanks!',
  already: 'You’re already on the list!',
  error: 'Something went wrong signing you up. Please try again, or email us directly.',
} as const;

/**
 * Monotonic suffix for the callback name.
 *
 * Two signups can be in flight at once — the footer's copy and the dialog's
 * are separate instances of the same component — and a shared callback name
 * would have the second response resolve the first promise. The timestamp
 * alone is not enough: two calls in the same millisecond collide.
 */
let callbackCounter = 0;

/** The global object, typed for the one thing this file does to it. */
function globalScope(): Record<string, unknown> {
  return window as unknown as Record<string, unknown>;
}

/**
 * Loads `url` as a script and resolves with whatever it passes to the global
 * function named `callbackName`.
 *
 * Settles exactly once and always cleans up after itself: the timer is
 * cleared, the global is deleted and the script element is removed, whether
 * the response arrived, errored or timed out. Leaving any of the three behind
 * leaks on a page where someone retries a few times.
 *
 * Rejects on network failure and on timeout. A blocked request — an ad
 * blocker, a strict extension, an offline phone — reaches `onerror`, and a
 * request that is answered with something that never calls the callback
 * reaches the timeout.
 */
function jsonp(url: string, callbackName: string): Promise<MailchimpResponse> {
  return new Promise<MailchimpResponse>((resolve, reject) => {
    const script = document.createElement('script');
    let settled = false;
    let timer = 0;

    function settle(finish: () => void) {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      delete globalScope()[callbackName];
      script.remove();
      finish();
    }

    timer = window.setTimeout(() => {
      settle(() => reject(new Error('Mailchimp request timed out')));
    }, TIMEOUT_MS);

    globalScope()[callbackName] = (data: MailchimpResponse) => {
      settle(() => resolve(data));
    };

    script.src = url;
    script.async = true;
    script.onerror = () => settle(() => reject(new Error('Mailchimp request failed')));
    document.head.appendChild(script);
  });
}

/**
 * Subscribes an address to the list.
 *
 * Returns a result rather than throwing: a failed signup is an ordinary state
 * of this UI, not an exception, and the component has somewhere to show it.
 *
 * MAILCHIMP'S `msg` IS NEVER RENDERED. It arrives as HTML — the
 * already-subscribed response carries an `<a>` to the profile-update page, and
 * validation errors come prefixed with a numeric code ('0 - ...'). React would
 * escape it rather than execute it, so this is not an injection risk, but it
 * would put raw markup and Mailchimp's internal codes in front of a visitor.
 * Every string returned from here is ours.
 *
 * The already-subscribed case is deliberately not an error. The person did the
 * thing they meant to do and the outcome they wanted is already true; telling
 * them it failed would be wrong, and inviting them to retry would just produce
 * the same answer.
 */
export async function subscribe(email: string): Promise<SubscribeResult> {
  // Belt and braces: this is only ever called from a submit handler in a
  // client component, but it touches `window` and `document` directly.
  if (typeof window === 'undefined') {
    return { status: 'error', message: MESSAGES.error };
  }

  callbackCounter += 1;
  const callbackName = `mailchimpJsonp_${Date.now()}_${callbackCounter}`;

  const params = new URLSearchParams({
    u: MAILCHIMP.u,
    id: MAILCHIMP.id,
    // EMAIL, uppercase: Mailchimp's merge-field name, not a convention we pick.
    EMAIL: email.trim(),
    // Always empty. A filled honeypot is Mailchimp's own bot signal.
    [MAILCHIMP.honeypotField]: '',
    // `c` names the callback the response wraps itself in.
    c: callbackName,
  });

  try {
    const response = await jsonp(`${MAILCHIMP.postJsonBase}?${params}`, callbackName);

    if (response.result === 'success') {
      return { status: 'success', message: MESSAGES.success };
    }

    // Mailchimp has no error code for this; the wording is all there is to go
    // on. Lowercased because the casing has changed before and may again.
    if (response.msg?.toLowerCase().includes('already subscribed')) {
      return { status: 'already', message: MESSAGES.already };
    }

    if (process.env.NODE_ENV !== 'production') {
      console.warn('[mailchimp] subscribe failed:', response.msg);
    }
    return { status: 'error', message: MESSAGES.error };
  } catch (cause) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[mailchimp] subscribe errored:', cause);
    }
    return { status: 'error', message: MESSAGES.error };
  }
}
