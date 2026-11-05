'use client';

import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import type { HeaderLogoSize, HeaderSurface, Link, SanityImage } from '@/types/content';

/**
 * NOTE: both sizes are now 18rem on desktop, so the distinction currently buys
 * nothing — `large` was 25rem until the hero redesign. Left in place rather than
 * collapsed because removing HeaderLogoSize touches the type, lib/content and
 * every call site, which is a bigger change than this one.
 *
 * The step is at lg, not sm, because that is where the hero's two columns
 * begin. Below it the wordmark is 10rem and sits opposite the trigger.
 */
const LOGO_WIDTHS: Record<HeaderLogoSize, string> = {
  default: 'w-48 lg:w-72',
  large: 'w-48 lg:w-[18rem]',
};

export interface SiteHeaderProps {
  siteName: string;
  logo?: SanityImage;
  navLinks: Link[];
  /**
   * Wordmark size per route path. Selected here rather than passed down because
   * the root layout has no access to the active route.
   */
  logoSizes: Record<string, HeaderLogoSize>;
  /**
   * What the header is sitting on per route path, same reason as above. Defaults
   * to 'photo', the cautious option: a route that forgets to declare itself gets
   * white-over-scrim, which stays legible on anything.
   */
  headerSurfaces: Record<string, HeaderSurface>;
}

/** Open state lives in SiteShell; this component only renders the trigger. */
interface SiteHeaderControlProps {
  open: boolean;
  onToggle: () => void;
  menuId: string;
  /** Owned by SiteShell so it can restore focus after an Escape keypress. */
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

/**
 * One header, one behavior on every page: transparent, sitting directly on the
 * image below it — the homepage hero or a sub-page's pageHeader.
 *
 * The gradient is a fixed protective scrim, not decoration and not an author
 * option. In Phase 2 the image underneath becomes author-selectable, and the
 * logo and trigger have to stay legible if someone picks a bright one. It is
 * deliberately independent of the hero's own scrim so neither depends on the
 * other existing.
 */
export function SiteHeader({
  siteName,
  logo,
  logoSizes,
  headerSurfaces,
  open,
  onToggle,
  menuId,
  triggerRef,
}: SiteHeaderProps & SiteHeaderControlProps) {
  const pathname = usePathname();
  const logoWidth = LOGO_WIDTHS[logoSizes[pathname] ?? 'default'];
  const onPhoto = (headerSurfaces[pathname] ?? 'photo') === 'photo';

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      {/* min-height, not height: the default lockup is comfortably shorter than
          the token, so pages that position themselves below the header (every
          pageHeader) still get exactly --spacing-header. The homepage's larger
          lockup is allowed to push the bar taller, and nothing there measures
          from the token. */}
      {/* items-start from lg: the lockup and the 44px trigger are very different
          heights there, so centring drifted their top edges apart by a different
          amount at every breakpoint, and each element's own padding sets it
          instead. Below lg the lockup is just the wordmark, close enough to the
          trigger's height that centring both is simpler and lets the bar
          collapse to its tallest child. */}
      {/* The trigger leads, then the wordmark. From lg they sit together on the
          left, so the wordmark's edge is the line the hero's text column aligns
          to. Below lg there is no such column, and pushing the wordmark to the
          right edge balances the bar and buys back the width the two of them
          were sharing. Source order is the visual order either way, so the tab
          order needs no override. */}
      <div className="relative flex min-h-[var(--spacing-header-compact)] items-center justify-between gap-3 px-[var(--spacing-gutter)] py-2 lg:min-h-[var(--spacing-header)] lg:items-start lg:justify-start lg:gap-5">
        {/* Only over a photograph. On a light surface the header draws itself in
            ink instead, and a dark wash there would be a smudge protecting
            nothing. Sized to the bar rather than to --spacing-header: the
            homepage's larger lockup pushes the bar past the token, and a
            fixed-height gradient would stop short of the wordmark. */}
        {onPhoto ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.5),transparent)]"
          />
        ) : null}

        <button
          ref={triggerRef}
          type="button"
          onClick={onToggle}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls={menuId}
          // -ml moves the bars nearer the edge without shrinking the tap target.
          // mt-2.5 plus the icon's 14px inset matches the wordmark's pt-6 below.
          className="relative -ml-2 flex size-[var(--tap-target)] shrink-0 flex-col items-center justify-center gap-[4.25px] lg:mt-2.5 sm:gap-[5px]"
        >
          {[0, 1, 2].map((bar) => (
            <span
              key={bar}
              aria-hidden="true"
              className={`block h-[2.5px] w-6 sm:h-[2px] ${onPhoto ? 'bg-white' : 'bg-mint lg:bg-ink'}`}
            />
          ))}
        </button>

        {/* pt-6 is the shared top edge from lg — the trigger's mt-2.5 plus its
            14px inset lands here too. Change one, change both.

            flex below lg so the link is exactly as tall as the wordmark inside
            it. As an inline-block its line-height made it 44px against the
            image's 38px, and the image sat at the top of that box — so the
            centred bar centred the box while the wordmark rode 3px high.
            items-center is load-bearing: a bare flex parent stretches the image
            to the container height and distorts the wordmark. */}
        {/* Hidden, not merely stacked behind: on phones the panel covers the
            full width, so the wordmark would otherwise sit on top of it.
            `invisible` rather than opacity so it also leaves the tab order. */}
        <NextLink
          href="/"
          className={`relative flex items-center lg:block lg:pt-6 ${
            open ? 'invisible sm:visible' : ''
          }`}
          aria-label={`${siteName} — home`}
        >
          {logo ? (
            // block, not the browser default inline: an inline image sits on a
            // text baseline and carries descender space beneath it, which made
            // the wordmark ride high inside the vertically centred bar.
            <img
              src={logo.url}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className={`block ${logoWidth}`}
            />
          ) : (
            <span
              className={`font-sans text-[length:var(--text-h3)] font-bold ${
                onPhoto ? 'text-white' : 'text-ink'
              }`}
            >
              {siteName}
            </span>
          )}
        </NextLink>

      </div>

    </header>
  );
}
