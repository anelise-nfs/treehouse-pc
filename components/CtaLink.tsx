import NextLink from 'next/link';
import type { ButtonVariant, Link } from '@/types/content';

/**
 * Renders an authored Link. Omitting `variant` gives an inline text link;
 * setting it gives a button.
 *
 * Every pairing below is on the approved contrast list. There is no variant
 * that puts white on a light brand color, and adding one is not a styling
 * decision — see ARCHITECTURE.md → Color rule.
 */
const BUTTON_STYLES: Record<ButtonVariant, string> = {
  'solid-ocean': 'bg-action text-white hover:bg-action-hover',
  'outline-ocean': 'border-2 border-action text-action',
  'outline-tangerine': 'border-2 border-tangerine text-ink',
  // Tangerine fill with an ink label: 5.44:1, the pairing --color-on-tangerine encodes.
  'solid-tangerine-ink': 'bg-tangerine text-on-tangerine',
};

const BUTTON_BASE =
  'inline-flex items-center justify-center min-h-[var(--tap-target)] px-6 ' +
  'rounded-[var(--radius-pill)] font-sans font-semibold text-[length:var(--text-ui)] ' +
  'no-underline transition-colors';

export interface CtaLinkProps {
  link: Link;
  className?: string;
}

export function CtaLink({ link, className = '' }: CtaLinkProps) {
  const styles = link.variant
    ? `${BUTTON_BASE} ${BUTTON_STYLES[link.variant]} ${className}`
    : `font-sans underline ${className}`;

  if (link.kind === 'internal') {
    return (
      <NextLink href={link.href} className={styles}>
        {link.label}
      </NextLink>
    );
  }

  return (
    <a
      href={link.href}
      className={styles}
      {...(link.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {link.label}
    </a>
  );
}
