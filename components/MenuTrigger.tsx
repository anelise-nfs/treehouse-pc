export interface MenuTriggerProps {
  open: boolean;
  onToggle: () => void;
  menuId: string;
  /** Owned by SiteShell so it can restore focus after an Escape keypress. */
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  /** White over a scrim when it sits on a photograph, brand colour otherwise. */
  onPhoto: boolean;
  /**
   * Show the lowercase "menu" caption under the bars. Only the homepage's
   * overlay header does, and only from lg — the sub-page bar swaps to its
   * horizontal nav at exactly the width that caption would appear at, so it
   * would never be seen there.
   */
  withLabel?: boolean;
}

/**
 * The hamburger button, shared by both site headers.
 *
 * One component rather than one per header on purpose: the two bars sit at
 * different widths and on different backgrounds, but the control itself has to
 * be the same object in both — same bar weight, same spacing, same 44px target,
 * same accessible name. Two copies would drift, and the brief for the sub-page
 * bar on a phone is specifically that it is indistinguishable from the
 * homepage's.
 */
export function MenuTrigger({
  open,
  onToggle,
  menuId,
  triggerRef,
  onPhoto,
  withLabel = false,
}: MenuTriggerProps) {
  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={onToggle}
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      aria-controls={menuId}
      // -ml moves the bars nearer the edge without shrinking the tap target,
      // and goes further at lg to give the wordmark room. The overlay header's
      // gap grows by the same 8px there, so the wordmark itself does not move —
      // the hero's text column is aligned to its left edge and would have to
      // follow it.
      //
      // min-h/min-w rather than a fixed size: the label below the bars makes
      // this taller than 44px on desktop, and a fixed height would have clipped
      // it. The minimum still holds on phones, where the label is hidden and
      // the bars alone would otherwise leave a 16px target.
      //
      // justify-center below lg, justify-start from it. With the label hidden
      // the bars are the whole control, and centring them in the 44px target
      // puts them on the bar's own centre line — the button's top edge is set
      // to clear the wordmark, so top-aligned bars sat visibly high in the
      // cream bar. From lg the label reappears beneath them and the stack is
      // top-aligned again, because there it lines up with the wordmark's top.
      className="relative -ml-2 flex min-h-[var(--tap-target)] min-w-[var(--tap-target)] shrink-0 flex-col items-center justify-center gap-[4.25px] sm:gap-[5px] lg:-ml-4 lg:justify-start"
    >
      {[0, 1, 2].map((bar) => (
        <span
          key={bar}
          aria-hidden="true"
          // w-6 on phones, where the bars are the entire control. w-8 from lg
          // is the labelled desktop version, sized to the caption beneath it.
          className={`block h-[2.5px] w-6 sm:h-[2px] ${withLabel ? 'lg:w-8' : ''} ${
            onPhoto ? 'bg-white' : 'bg-mint lg:bg-ink'
          }`}
        />
      ))}

      {/* Desktop only, and the bars widen to 2.25rem there to match this
          label's 34.7px rather than the other way round — sized down to the
          24px bar the word would have had to run at 9px.

          Left as real text rather than aria-hidden: the button's accessible
          name is "Open menu"/"Close menu", both of which contain this visible
          word, so WCAG's Label in Name holds. */}
      {withLabel ? (
        <span
          className={`mt-1 hidden font-sans text-[length:var(--text-caption)] font-semibold leading-none lg:block ${
            onPhoto ? 'text-white' : 'text-ink'
          }`}
        >
          menu
        </span>
      ) : null}
    </button>
  );
}
