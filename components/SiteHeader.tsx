'use client';

import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import type { HeaderLogoSize, HeaderSurface, Link, SanityImage } from '@/types/content';
import { MenuTrigger } from '@/components/MenuTrigger';

/**
 * NOTE: both sizes are identical, so the distinction currently buys nothing —
 * `large` was 25rem until the hero redesign. Left in place rather than
 * collapsed because removing HeaderLogoSize touches the type, lib/content and
 * every call site, which is a bigger change than this one.
 *
 * The step is at lg, not sm, because that is where the hero's two columns
 * begin. Below it the wordmark sits opposite the trigger, and 15rem is as wide
 * as it goes: at 320px anything larger runs into the trigger beside it.
 */
const LOGO_WIDTHS: Record<HeaderLogoSize, string> = {
  default: 'w-60 lg:w-80',
  large: 'w-60 lg:w-80',
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
    /* Sticky below lg, absolute from it.
     *
     * Below lg this is a real bar: it is in flow, it is cream, and it pins to
     * the top so the wordmark and the menu stay reachable the whole way down
     * the page — the same behaviour the sub-page bar has, so the header works
     * identically on every page at phone and tablet width.
     *
     * From lg it goes back to being an overlay on the hero with nothing behind
     * it, which is the homepage's desktop treatment and is unchanged. Nothing
     * on the desktop homepage sticks.
     *
     * The hero no longer reserves a strip of linen for this to sit over — it
     * cannot, now that the bar occupies its own height below lg. See the
     * hero's own note. */
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-linen lg:absolute lg:inset-x-0 lg:top-0 lg:border-0 lg:bg-transparent">
      {/* min-height, not height: the default lockup is comfortably shorter than
          the token, so pages that position themselves below the header (every
          pageHeader) still get exactly --spacing-header. The homepage's larger
          lockup is allowed to push the bar taller, and nothing there measures
          from the token. */}
      {/* Below lg this is a solid bar with a height of its own, so its contents
          are simply centred in it. They used to be top-aligned and pushed down
          by a padding derived from the gutter, so that the inset off the top of
          the viewport matched the inset off its left edge — which worked while
          the header was a transparent overlay with no bar to sit in. Against a
          fixed-height bar it drifts: the padding grows with the viewport and
          the bar does not, so by 768 the whole lockup sat 6px low with the
          space above it nearly three times the space below.

          From lg the overlay returns and so does that padding. There the
          lockup and the 44px trigger are very different heights, so centring
          drifted their top edges apart by a different amount at every
          breakpoint, and each element's own padding sets it instead.

          The trigger leads, then the wordmark. From lg they sit together on the
          left, so the wordmark's edge is the line the hero's text column aligns
          to. Below lg there is no such column, and pushing the wordmark to the
          right edge balances the bar and buys back the width the two of them
          were sharing. Source order is the visual order either way, so the tab
          order needs no override. */}
      <div className="relative flex min-h-[var(--spacing-header-compact)] items-center justify-between gap-3 px-[var(--spacing-gutter)] py-2 lg:min-h-[var(--spacing-header)] lg:items-start lg:justify-start lg:gap-7 lg:pb-2 lg:pt-[calc(var(--spacing-gutter)-1rem+(var(--tap-target)-2rem)/2)]">
        {/* Only over a photograph. On a light surface the header draws itself in
            ink instead, and a dark wash there would be a smudge protecting
            nothing. Sized to the bar rather than to --spacing-header: the
            homepage's larger lockup pushes the bar past the token, and a
            fixed-height gradient would stop short of the wordmark. */}
        {onPhoto ? (
          <div
            aria-hidden="true"
            // From lg only. Below it the bar draws itself cream and sits on
            // nothing, so a dark wash there would be a smudge over a solid
            // fill rather than protection over a photograph.
            className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(to_bottom,rgba(0,0,0,0.5),transparent)] lg:block"
          />
        ) : null}

        <MenuTrigger
          open={open}
          onToggle={onToggle}
          menuId={menuId}
          triggerRef={triggerRef}
          onPhoto={onPhoto}
          withLabel
        />

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
          className={`relative flex items-start lg:block ${
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
