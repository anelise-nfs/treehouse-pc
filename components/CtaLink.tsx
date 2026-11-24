import NextLink from 'next/link';
import type { Link } from '@/types/content';
import { BUTTON_BASE, BUTTON_STYLES, ButtonMark } from '@/components/Button';
import { CheckoutTrigger } from '@/components/CheckoutTrigger';
import { NewsletterTrigger } from '@/components/NewsletterTrigger';

/**
 * Renders an authored Link. Omitting `variant` gives an inline text link;
 * setting it gives a button, wearing the shared treatment in Button.tsx — the
 * same one the forms' submit buttons use.
 */
export interface CtaLinkProps {
  link: Link;
  className?: string;
}

export function CtaLink({ link, className = '' }: CtaLinkProps) {
  const styles = link.variant
    ? `${BUTTON_BASE} ${BUTTON_STYLES[link.variant]} ${className}`
    : `font-sans underline ${className}`;

  const content = (
    <>
      {link.variant ? <ButtonMark /> : null}
      {link.label}
    </>
  );

  // Open something instead of navigating. These two triggers are the only
  // client components in this file's output, so a page full of CtaLinks stays
  // server-rendered unless it actually has one of them.
  if (link.kind === 'newsletter') {
    return <NewsletterTrigger className={styles}>{content}</NewsletterTrigger>;
  }

  // `checkout` carries the target; without it there is nothing to open, so the
  // link falls through to the plain anchor below and still reaches the store
  // through its href. A missing target is an authoring mistake and says so in
  // development rather than rendering a button that quietly does nothing.
  if (link.kind === 'checkout') {
    if (link.checkout) {
      return (
        <CheckoutTrigger target={link.checkout} href={link.href} className={styles}>
          {content}
        </CheckoutTrigger>
      );
    }

    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[content] Link "${link.label}" is kind 'checkout' but has no \`checkout\` target. ` +
          'Rendered as a plain link to its href.',
      );
    }
  }

  if (link.kind === 'internal') {
    return (
      <NextLink href={link.href} className={styles}>
        {content}
      </NextLink>
    );
  }

  return (
    <a
      href={link.href}
      className={styles}
      {...(link.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {content}
    </a>
  );
}
