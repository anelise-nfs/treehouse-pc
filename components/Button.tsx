import type { ButtonVariant } from '@/types/content';
import { Doodle } from '@/components/doodles/Doodle';

/**
 * Button treatments, shared by the authored-link buttons (CtaLink) and the
 * real `<button>` elements inside the forms.
 *
 * One source for both. These used to live inside CtaLink, so a form's submit
 * button had no way to reach them and grew its own near-copy — which came out
 * without the hover lift, without the mark, and without a pointer cursor,
 * because Tailwind v4 no longer sets one on `<button>`. A person cannot tell
 * which of two buttons happens to be an anchor underneath.
 *
 * Every pairing below is on the approved contrast list. Adding a variant that
 * puts white on a light brand color is not a styling decision — see
 * ARCHITECTURE.md → Color rule.
 *
 * Hover states are paired with focus-visible throughout, so a keyboard user gets
 * the same feedback as a mouse user. The outline variants fill on hover, which
 * is the most legible change available to them; both filled pairings stay on the
 * approved contrast list when they do (white on action 6.62:1, white on
 * tangerine 4.67:1). The solid tangerines darken by filter rather than by a
 * second token.
 */
export const BUTTON_STYLES: Record<ButtonVariant, string> = {
  'solid-ocean': 'bg-action text-white hover:bg-action-hover focus-visible:bg-action-hover',
  'outline-ocean':
    'border-2 border-action text-action hover:bg-action hover:text-white ' +
    'focus-visible:bg-action focus-visible:text-white',
  'outline-tangerine':
    'border-2 border-tangerine text-ink hover:bg-tangerine hover:text-on-tangerine ' +
    'focus-visible:bg-tangerine focus-visible:text-on-tangerine',
  // NAME IS NOW STALE: --color-on-tangerine is white at Option A depth, so this
  // renders identically to solid-tangerine-white. Both are 4.67:1. Collapsing
  // the two is a type + content change, left for the palette decision.
  'solid-tangerine-ink': 'bg-tangerine text-on-tangerine hover:brightness-90 focus-visible:brightness-90',
  'solid-tangerine-white': 'bg-tangerine text-white hover:brightness-90 focus-visible:brightness-90',
};

/**
 * What makes a button feel like a button here: the pointer, the lift, and the
 * positioning context the hover mark needs.
 *
 * Separate from BUTTON_BASE so a button that sets its own size — the footer's
 * compact signup, which has to sit beside an input — still behaves the same on
 * hover without inheriting the full-size padding and type scale.
 *
 * The lift is a transform, so it changes nothing in the layout — neighbouring
 * content cannot be pushed by a button growing. `prefers-reduced-motion` is
 * handled globally in globals.css, which collapses the transition to an instant
 * state change rather than removing the feedback. A disabled button does not
 * lift, because it is not going to do anything.
 */
export const BUTTON_INTERACTION =
  'group relative cursor-pointer transition duration-150 ease-out ' +
  'hover:scale-105 focus-visible:scale-105 ' +
  'disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100';

export const BUTTON_BASE =
  'inline-flex items-center justify-center min-h-[var(--tap-target)] px-8 py-3 ' +
  'rounded-[var(--radius-pill)] font-sans font-semibold text-[length:var(--text-body)] ' +
  `no-underline ${BUTTON_INTERACTION}`;

/**
 * The button mark that appears on the button's top-left corner on hover, sitting
 * roughly two thirds on it and one third off.
 *
 * Decorative and aria-hidden: the button's accessible name is unchanged, and
 * pointer-events are off so it can never swallow the click it sits on. Revealed
 * on focus-visible too, so it is not mouse-only.
 */
export function ButtonMark() {
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

export interface ActionButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  /** Defaults to the primary treatment, which is what a form's submit wants. */
  variant?: ButtonVariant;
  className?: string;
}

/**
 * A real `<button>` wearing the site's button treatment — for form submits,
 * where CtaLink's anchor is wrong.
 */
export function ActionButton({
  variant = 'solid-ocean',
  className = '',
  children,
  ...props
}: ActionButtonProps) {
  return (
    <button {...props} className={`${BUTTON_BASE} ${BUTTON_STYLES[variant]} ${className}`}>
      <ButtonMark />
      {children}
    </button>
  );
}
