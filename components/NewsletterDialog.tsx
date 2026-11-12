'use client';

import { useEffect, useRef, useState } from 'react';
import { NewsletterSignup } from '@/components/NewsletterSignup';

/**
 * Broadcast by NewsletterTrigger, listened for here.
 *
 * An event rather than React context: the triggers are rendered deep inside
 * server-rendered block trees by CtaLink, and threading a provider down to
 * them would make every block on the route a client component. This keeps the
 * client boundary around the two pieces that actually need it.
 */
export const NEWSLETTER_OPEN_EVENT = 'treehouse:newsletter-open';

/**
 * The mailing-list signup as a modal.
 *
 * Mounted once, in SiteShell, so every page has it and any trigger anywhere
 * can open it.
 *
 * A native `<dialog>` with `showModal()`, not a hand-rolled overlay. The
 * browser gives the focus trap, the Escape handler, the inert background and
 * the top-layer stacking for free — the four things a hand-rolled modal
 * usually gets wrong, and which would otherwise be a lot of code to own in a
 * repo with no component library.
 *
 * It wraps the same NewsletterSignup the footer renders, so there is one
 * signup implementation and one endpoint. This copy does not take the
 * `#newsletter` id; the footer's does.
 */
export function NewsletterDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onOpen() {
      const dialog = dialogRef.current;
      if (!dialog || dialog.open) return;
      dialog.showModal();
      setOpen(true);
    }

    window.addEventListener(NEWSLETTER_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(NEWSLETTER_OPEN_EVENT, onOpen);
  }, []);

  // showModal() does not stop the page behind from scrolling, which on a phone
  // means the modal appears to float over a moving background.
  useEffect(() => {
    if (!open) return;
    const { style } = document.documentElement;
    const previous = style.overflow;
    style.overflow = 'hidden';
    return () => {
      style.overflow = previous;
    };
  }, [open]);

  function close() {
    dialogRef.current?.close();
  }

  return (
    <dialog
      ref={dialogRef}
      // `close` fires for Escape and for the close button alike, so the state
      // is synced in one place rather than at each call site.
      onClose={() => setOpen(false)}
      // A click whose target is the dialog itself landed on the backdrop —
      // the content is in a child, so anything inside reports that child.
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      aria-labelledby="newsletter-dialog-title"
      // m-auto restores the centring a native dialog does for itself: Tailwind's
      // preflight zeroes margins on every element, which pinned it to the top
      // of the viewport.
      className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-[var(--radius-card)] border-0 bg-linen p-0 text-ink backdrop:bg-ink/60"
    >
      <div className="relative p-[var(--spacing-block)]">
        {/* Last in the DOM but positioned top-right: the dialog autofocuses
            its first focusable child, and that should be the email field, not
            the dismiss button. */}
        {/* The dialog stays open on success so the confirmation is readable;
            the close button below dismisses it. Auto-closing would hide the
            one piece of feedback the person is waiting for. */}
        <NewsletterSignup tone="light" withAnchor={false} headingId="newsletter-dialog-title" />

        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-2 top-2 flex min-h-[var(--tap-target)] min-w-[var(--tap-target)] cursor-pointer items-center justify-center rounded-[var(--radius-pill)] text-[length:var(--text-h3)] leading-none text-ink-soft hover:text-ink focus-visible:text-ink"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </dialog>
  );
}
