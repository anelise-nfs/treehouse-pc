'use client';

import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import type { HeaderLogoSize, Link, SanityImage } from '@/types/content';

/**
 * Locality line under the wordmark.
 *
 * Hardcoded deliberately: it reads as part of the brand lockup rather than as
 * page content, and a second location changes it here in code. If it ever needs
 * to vary per location instead, SiteSettings.location already carries
 * `address.city` and `address.region`.
 */
const LOGO_LOCALITY = 'Park City, Utah';

/**
 * The two sizes differ on desktop (400px against 288px) and match on mobile,
 * where a phone has no room to spare beside the menu trigger.
 */
const LOGO_WIDTHS: Record<HeaderLogoSize, string> = {
  default: 'w-52 sm:w-72',
  large: 'w-52 sm:w-[25rem]',
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
  open,
  onToggle,
  menuId,
  triggerRef,
}: SiteHeaderProps & SiteHeaderControlProps) {
  const pathname = usePathname();
  const logoWidth = LOGO_WIDTHS[logoSizes[pathname] ?? 'default'];

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      {/* min-height, not height: the default lockup is comfortably shorter than
          the token, so pages that position themselves below the header (every
          pageHeader) still get exactly --spacing-header. The homepage's larger
          lockup is allowed to push the bar taller, and nothing there measures
          from the token. */}
      {/* items-start: the lockup and the 44px trigger are very different heights,
          so centring drifted their top edges apart by a different amount at every
          breakpoint. Anchored to the top, each element's own padding sets it. */}
      <div className="relative flex min-h-[var(--spacing-header)] items-start justify-between gap-4 px-[var(--spacing-gutter)] py-2">
        {/* Sized to the bar rather than to --spacing-header: the homepage's
            larger lockup pushes the bar past the token, and a fixed-height
            gradient would stop short of the wordmark it is protecting. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.5),transparent)]"
        />

        {/* pl matches the hamburger icon's own inset inside its tap target, whose
            padding is invisible. pt-6 is the shared top edge — the trigger's
            mt-2.5 plus its 14px inset lands here too. Change one, change both. */}
        {/* Hidden, not merely stacked behind: on phones the panel covers the
            full width, so the wordmark would otherwise sit on top of it.
            `invisible` rather than opacity so it also leaves the tab order. */}
        <NextLink
          href="/"
          className={`relative inline-block pl-[0.625rem] pt-6 ${
            open ? 'invisible sm:visible' : ''
          }`}
          aria-label={`${siteName} — home`}
        >
          {logo ? (
            <span className="block">
              <img
                src={logo.url}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className={logoWidth}
              />
              {/* The block is exactly as wide as the wordmark, so text-right stays
                  flush with the logo's edge at every size. */}
              <span className="mt-0.5 block text-right font-sans text-[length:var(--text-body)] font-semibold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
                {LOGO_LOCALITY}
              </span>
            </span>
          ) : (
            <span className="font-sans text-[length:var(--text-h3)] font-bold text-white">
              {siteName}
            </span>
          )}
        </NextLink>

        <button
          ref={triggerRef}
          type="button"
          onClick={onToggle}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls={menuId}
          // -mr moves the bars nearer the edge without shrinking the tap target.
          // mt-2.5 plus the icon's 14px inset matches the wordmark's pt-6 above.
          className="relative -mr-2 mt-2.5 flex size-[var(--tap-target)] shrink-0 flex-col items-center justify-center gap-[4.25px] sm:gap-[5px]"
        >
          {[0, 1, 2].map((bar) => (
            <span key={bar} aria-hidden="true" className="block h-[2.5px] w-6 bg-white sm:h-[2px]" />
          ))}
        </button>
      </div>

    </header>
  );
}
