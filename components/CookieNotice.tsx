'use client';

import { useEffect, useState } from 'react';

/**
 * Where the dismissal is remembered.
 *
 * Namespaced so it cannot collide with anything else on the origin, and
 * versioned so that if the notice's wording ever changes materially it can be
 * shown again by bumping the suffix rather than by clearing storage.
 */
const STORAGE_KEY = 'tpc.cookie-notice.v1';

/**
 * localStorage, defensively.
 *
 * Reading or writing it throws outright in Safari's private mode and wherever
 * site data is blocked, and the whole point of this component is that it is
 * incidental — a storage failure must never take the page down with it. Both
 * directions swallow the error: a failed read shows the notice again, a failed
 * write means it will reappear next visit. Neither is worth an error boundary.
 */
function hasDismissed(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function rememberDismissal(): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, 'true');
  } catch {
    // Dismissal holds for this page view either way; it just will not persist.
  }
}

/**
 * Informational cookie notice, fixed to the bottom of the viewport.
 *
 * INFORMATIONAL ONLY. Nothing here gates a script: dismissing it records that
 * the notice was seen and nothing else. That is the US "notice" posture, not
 * GDPR consent. If this site ever needs real consent — Google Consent Mode,
 * or an EU audience — this component is the place it goes, and the stored
 * value becomes a preference rather than a receipt. Until then, do not let the
 * presence of a banner imply that anything is being withheld before it is
 * clicked.
 *
 * Renders nothing on the server and nothing on the first client paint, then
 * appears once mounted if it has not been dismissed. Reading localStorage
 * during render would produce different markup on the server and the client
 * and hydrate badly; this trades a late appearance for correctness.
 */
export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasDismissed()) setVisible(true);
  }, []);

  function dismiss() {
    setVisible(false);
    rememberDismissal();
  }

  if (!visible) return null;

  return (
    // role="region" with a label, not role="dialog": this takes no focus, traps
    // none, and blocks nothing behind it. Announcing it as a dialog would tell
    // a screen reader user they are somewhere modal when they are not.
    //
    // z-40 sits above page content but below the sticky header (z-50) and the
    // slide-out menu (z-60), so an open menu covers it rather than fighting it.
    //
    // The wrapper is pointer-events-none and only the panel re-enables them, so
    // the strip of viewport beside the panel stays clickable on wide screens.
    <div
      role="region"
      aria-label="Cookie notice"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 p-[var(--spacing-gutter)]"
    >
      {/* Linen on a border, not a drop shadow: nothing else on this site casts
          one, and the sticky header and top bar — the same category of chrome
          floating over page content — separate themselves with border-ink/10.
          A single shadow here would be the only one in the design language. */}
      <div className="pointer-events-auto mx-auto flex max-w-[var(--spacing-container)] flex-col gap-[var(--spacing-gutter)] rounded-[var(--radius-card)] border border-ink/10 bg-linen p-[var(--spacing-gutter)] sm:flex-row sm:items-center">
        <p className="flex-1 font-sans text-[length:var(--text-ui)] text-ink">
          We use cookies to keep things running smoothly and see how our site is used.{' '}
          {/* PLACEHOLDER: the privacy policy page does not exist yet. '#' matches
              the footer's legalNav entry, which is the same placeholder; both
              become '/privacy' together when that page lands. */}
          <a href="#" className="underline underline-offset-2">
            Privacy Policy
          </a>
        </p>

        <div className="flex items-center gap-2 sm:shrink-0">
          {/* Not the shared ActionButton: that one carries the full CTA
              treatment — 2rem padding, the hover lift and the cookie doodle —
              which is far too much weight for a dismissal. This is the same
              fill and radius at a smaller scale. */}
          <button
            type="button"
            onClick={dismiss}
            className="inline-flex min-h-[var(--tap-target)] cursor-pointer items-center justify-center rounded-[var(--radius-pill)] bg-action px-6 py-2 font-sans text-[length:var(--text-ui)] font-medium text-white transition-colors duration-150 ease-out hover:bg-action-hover focus-visible:bg-action-hover"
          >
            Sounds good
          </button>

          {/* A second control doing the same thing as the button beside it, for
              people who read an x as "make this go away" and look for nothing
              else. aria-label because the glyph is decorative, and the two have
              distinct names so they are not announced as duplicates. */}
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss cookie notice"
            className="flex min-h-[var(--tap-target)] min-w-[var(--tap-target)] cursor-pointer items-center justify-center rounded-[var(--radius-pill)] text-[length:var(--text-h3)] leading-none text-ink-soft hover:text-ink focus-visible:text-ink"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
    </div>
  );
}
