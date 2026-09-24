import NextLink from 'next/link';
import type { ButtonVariant, Link } from '@/types/content';
import { Doodle } from '@/components/doodles/Doodle';

/**
 * Button treatments for an authored Link. Omitting `variant` gives an inline
 * text link; setting it gives a button.
 *
 * Every pairing below is on the approved contrast list except the temporary
 * solid-tangerine-white. Adding a variant that puts white on a light brand color
 * is not a styling decision — see ARCHITECTURE.md → Color rule.
 *
 * Hover states are paired with focus-visible throughout, so a keyboard user gets
 * the same feedback as a mouse user. The outline variants fill on hover, which
 * is the most legible change available to them; both filled pairings stay on the
 * approved contrast list when they do (white on action 6.62:1, ink on tangerine
 * 5.44:1). The solid tangerines darken by filter rather than by a second token.
 */
const BUTTON_STYLES: Record<ButtonVariant, string> = {
  'solid-ocean': 'bg-action text-white hover:bg-action-hover focus-visible:bg-action-hover',
  'outline-ocean':
    'border-2 border-action text-action hover:bg-action hover:text-white ' +
    'focus-visible:bg-action focus-visible:text-white',
  'outline-tangerine':
    'border-2 border-tangerine text-ink hover:bg-tangerine hover:text-on-tangerine ' +
    'focus-visible:bg-tangerine focus-visible:text-on-tangerine',
  // Tangerine fill with an ink label: 5.44:1, the pairing --color-on-tangerine encodes.
  'solid-tangerine-ink': 'bg-tangerine text-on-tangerine hover:brightness-90 focus-visible:brightness-90',
  // Temporary, pending the ADA sweep.
  'solid-tangerine-white': 'bg-tangerine text-white hover:brightness-90 focus-visible:brightness-90',
};

/**
 * The lift is a transform, so it changes nothing in the layout — neighbouring
 * content cannot be pushed by a button growing. `prefers-reduced-motion` is
 * handled globally in globals.css, which collapses the transition to an instant
 * state change rather than removing the feedback.
 */
const BUTTON_BASE =
  'inline-flex items-center justify-center min-h-[var(--tap-target)] px-8 py-3 ' +
  'rounded-[var(--radius-pill)] font-sans font-semibold text-[length:var(--text-body)] ' +
  'no-underline transition duration-150 ease-out ' +
  'group relative hover:scale-105 focus-visible:scale-105';

/**
 * The button mark that appears on the button's top-left corner on hover, sitting
 * roughly two thirds on it and one third off.
 *
 * Decorative and aria-hidden: the link's accessible name is unchanged, and
 * pointer-events are off so it can never swallow the click it sits on. Revealed
 * on focus-visible too, so it is not mouse-only.
 */
function ButtonMark() {
  return (
    <Doodle
      name="cookie"
      color="mint"
      className={
        'pointer-events-none absolute left-0 top-0 w-10 -translate-x-1/3 -translate-y-1/3 ' +
        'opacity-0 transition-opacity duration-150 ' +
        'group-hover:opacity-100 group-focus-visible:opacity-100'
      }
    />
  );
}

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
