'use client';

import { NEWSLETTER_OPEN_EVENT } from '@/components/NewsletterDialog';
import { NEWSLETTER_ANCHOR } from '@/components/NewsletterSignup';

export interface NewsletterTriggerProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * Opens the newsletter dialog.
 *
 * An anchor to the footer's signup, not a button, and the dialog is an
 * enhancement layered on top: without JavaScript the link still goes somewhere
 * real. With it, the click is intercepted and the modal opens instead, so the
 * visitor is never thrown eight screens down the page.
 *
 * Modifier-clicks and middle-clicks fall through untouched, so "open in new
 * tab" still behaves like a link.
 */
export function NewsletterTrigger({ className = '', children }: NewsletterTriggerProps) {
  return (
    <a
      href={`#${NEWSLETTER_ANCHOR}`}
      className={className}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        window.dispatchEvent(new CustomEvent(NEWSLETTER_OPEN_EVENT));
      }}
    >
      {children}
    </a>
  );
}
