import NextLink from 'next/link';
import type { Link } from '@/types/content';
import { BUTTON_BASE, BUTTON_STYLES, ButtonMark } from '@/components/Button';
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

  // Opens the dialog instead of navigating. NewsletterTrigger is the only
  // client component in this file's output, so a page full of CtaLinks stays
  // server-rendered unless it actually has one of these.
  if (link.kind === 'newsletter') {
    return <NewsletterTrigger className={styles}>{content}</NewsletterTrigger>;
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
