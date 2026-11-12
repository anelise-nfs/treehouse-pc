'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { BUTTON_INTERACTION } from '@/components/Button';
import {
  HONEYPOT_FIELD,
  MAILCHIMP_ENDPOINT,
  isValidEmail,
  submitForm,
  type FormStatus,
} from '@/lib/forms';

/**
 * The anchor every "sign up for updates" button points at.
 *
 * Exported so the content layer links to the same string this element carries,
 * rather than a hand-typed '#newsletter' that can drift out of step with it.
 */
export const NEWSLETTER_ANCHOR = 'newsletter';

/**
 * Surface the signup is sitting on. Two, because two exist: the footer's pine
 * and anything on linen. Which one is in play decides the text colour and the
 * input's border, and both pairings are on the approved list.
 */
export type NewsletterTone = 'dark' | 'light';

const TONE = {
  dark: {
    // White on pine, 6.66:1 — the one brand colour that takes white text.
    heading: 'text-white',
    body: 'text-white',
    // The field itself is white with ink in it either way: a tinted input on
    // pine would have to carry its own contrast argument, and a plain white
    // field is what people expect to type into.
    input: 'border-white/40',
    button: 'bg-white text-pine hover:bg-white/90 focus-visible:bg-white/90',
  },
  light: {
    heading: 'text-ink',
    body: 'text-ink-soft',
    input: 'border-ink/25',
    button: 'bg-action text-white hover:bg-action-hover focus-visible:bg-action-hover',
  },
} as const satisfies Record<NewsletterTone, Record<string, string>>;

export interface NewsletterSignupProps {
  tone?: NewsletterTone;
  heading?: string;
  blurb?: string;
  className?: string;
  /** Lets a dialog point `aria-labelledby` at this signup's own heading. */
  headingId?: string;
  /**
   * Smaller heading and tighter spacing, for the footer column. The dialog
   * keeps the full size: there it is the only thing on screen.
   */
  compact?: boolean;
  /**
   * Whether this instance owns the `#newsletter` anchor and the focus-on-
   * arrival behaviour that goes with it.
   *
   * Exactly one instance may: ids are unique, and two elements answering to
   * the same hash is a bug rather than a redundancy. The footer's copy owns
   * it — it is the one that exists on every page and the one a no-JS visitor
   * reaches. The dialog's copy passes false.
   */
  withAnchor?: boolean;
}

/**
 * Email capture for the mailing list. Separate from the contact form, and not a
 * variant of it: this one adds an address to a list, the other sends the
 * business a message. See lib/forms.ts.
 *
 * Lives here rather than in /blocks because the footer is site chrome and has
 * no block array — but it takes everything it renders as props, so dropping it
 * into a page later is a matter of calling it.
 *
 * It owns the id the site's "sign up for updates" buttons target. Landing on it
 * from one of those moves focus into the field, so a keyboard user arrives
 * ready to type rather than somewhere near the right part of the page.
 */
export function NewsletterSignup({
  tone = 'dark',
  heading = 'join the email club',
  blurb = 'Opening news, founding-member offers, and the occasional very good photo of a slide. Unsubscribe any time.',
  className = '',
  headingId,
  compact = false,
  withAnchor = true,
}: NewsletterSignupProps) {
  const styles = TONE[tone];
  const fieldId = useId();
  const statusId = useId();
  const blurbId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [error, setError] = useState('');

  // Arriving from one of the CTAs that links here. Both the initial hash (a
  // cold load of /#newsletter) and later hashchanges (clicking the hero button
  // while already on the homepage) have to be handled — the second fires no
  // navigation, so there is no other hook for it.
  useEffect(() => {
    if (!withAnchor) return;

    function focusIfTargeted() {
      if (window.location.hash === `#${NEWSLETTER_ANCHOR}`) inputRef.current?.focus();
    }

    focusIfTargeted();
    window.addEventListener('hashchange', focusIfTargeted);
    return () => window.removeEventListener('hashchange', focusIfTargeted);
  }, [withAnchor]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValidEmail(email)) {
      setStatus('error');
      setError('Please enter a valid email address.');
      inputRef.current?.focus();
      return;
    }

    const form = event.currentTarget;
    // Silently accept and do nothing: a bot gets no signal that it was caught.
    if ((new FormData(form).get(HONEYPOT_FIELD) as string)?.trim()) {
      setStatus('success');
      return;
    }

    setStatus('submitting');
    setError('');

    const result = await submitForm(MAILCHIMP_ENDPOINT, { email: email.trim() });

    if (result.ok) {
      setStatus('success');
      setEmail('');
      return;
    }

    setStatus('error');
    setError(result.message ?? '');
  }

  return (
    <div
      id={withAnchor ? NEWSLETTER_ANCHOR : undefined}
      className={`scroll-mt-[var(--spacing-header-compact)] ${className}`}
    >
      <h2
        id={headingId}
        className={`font-script leading-[var(--leading-heading)] ${
          compact ? 'text-[length:var(--text-script-footer)]' : 'text-[length:var(--text-script-badge)]'
        } ${styles.heading}`}
      >
        {heading}
      </h2>

      {/* aria-live on a wrapper that is always present, not on the message
          itself: a region inserted at the same moment its text appears is not
          reliably announced. Polite rather than assertive — nothing here is
          urgent enough to interrupt. */}
      <div aria-live="polite" id={statusId}>
        {status === 'success' ? (
          <p className={`mt-3 font-sans text-[length:var(--text-ui)] ${styles.body}`}>
            You&rsquo;re on the list — thanks! Watch your inbox.
          </p>
        ) : null}
        {status === 'error' && error ? (
          <p className={`mt-3 font-sans text-[length:var(--text-ui)] ${styles.body}`}>{error}</p>
        ) : null}
      </div>

      {status === 'success' ? null : (
        <>
          {/* Carries the consent as well as the pitch: what they will get,
              and that they can leave. Not a checkbox — this form does nothing
              but subscribe, so submitting it is the affirmative act, and a
              tickbox on a single-purpose form is friction without a consent
              argument behind it.

              Tied to the field with aria-describedby so it is read out when
              the field takes focus rather than only being visible. */}
          <p
            id={blurbId}
            className={`mt-2 font-sans text-[length:var(--text-caption)] leading-[1.45] ${styles.body}`}
          >
            {blurb}
          </p>

          {/* @container, not a breakpoint: this sits in a footer column at one
              width and in a dialog at another, and what decides whether the
              field and button fit side by side is how wide *it* is, not how
              wide the window is. */}
          <form onSubmit={onSubmit} noValidate className="@container mt-3">
            {/* A real label, not a placeholder standing in for one: a
                placeholder disappears as soon as there is text in the field and
                is not a reliable accessible name. sr-only because the heading
                and button above and beside it already say what this is. */}
            <label htmlFor={fieldId} className="sr-only">
              Email address
            </label>

            <div className="flex flex-col gap-2 @[20rem]:flex-row">
              <input
                ref={inputRef}
                id={fieldId}
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                aria-invalid={status === 'error' ? true : undefined}
                aria-describedby={`${statusId} ${blurbId}`}
                placeholder="you@example.com"
                className={`min-h-[var(--tap-target)] w-full min-w-0 rounded-[var(--radius-pill)] border bg-white px-4 font-sans text-[length:var(--text-caption)] text-ink placeholder:text-ink-soft @[20rem]:flex-1 ${styles.input}`}
              />

              <HoneypotField />

              {/* Its own size — it has to sit beside the field rather than
                  fill a line of its own — and the only button on the site
                  without the hover mark. BUTTON_INTERACTION still gives it the
                  pointer and the lift; ButtonMark is deliberately left off.
                  The mark sits two thirds off the button's top-left corner,
                  which here is a few pixels from the email field beside it,
                  and it landed across the field in both places this renders —
                  the footer column and the dialog. Nowhere else is a button
                  that close to another control. */}
              <button
                type="submit"
                disabled={status === 'submitting'}
                // px-5 and the caption type: this sits beside a field rather
                // than standing alone, and at the body scale with px-6 the two
                // together read as a slab. The 44px minimum height stays —
                // ARCHITECTURE.md → Accessibility baseline puts the floor for
                // a primary control there, and width is the dimension free to
                // give.
                className={`min-h-[var(--tap-target)] shrink-0 rounded-[var(--radius-pill)] px-5 font-sans text-[length:var(--text-caption)] font-semibold ${BUTTON_INTERACTION} ${styles.button}`}
              >
                {status === 'submitting' ? 'Signing up…' : 'Sign up'}
              </button>
            </div>

          </form>
        </>
      )}
    </div>
  );
}

/**
 * The honeypot. `hidden` rather than off-screen positioning: off-screen fields
 * are still reachable by screen readers and by tabbing, and a person filling
 * one in would have their message dropped. tabIndex and aria-hidden are belt
 * and braces for the same reason.
 */
export function HoneypotField() {
  return (
    <input
      type="text"
      name={HONEYPOT_FIELD}
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      hidden
    />
  );
}
