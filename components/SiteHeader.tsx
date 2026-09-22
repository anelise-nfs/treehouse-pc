'use client';

import { useEffect, useId, useRef, useState } from 'react';
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
 * The homepage hero carries a wordmark at roughly twice the sub-page size.
 *
 * Desktop is a true 2x (288px -> 576px). Mobile is capped rather than doubled:
 * 2x of 208px is 416px, wider than a 390px viewport once the gutters and the
 * menu trigger are accounted for, so `large` takes the widest size that still
 * fits (288px) instead of overflowing the page.
 */
const LOGO_WIDTHS: Record<HeaderLogoSize, string> = {
  default: 'w-52 sm:w-72',
  large: 'w-72 sm:w-[36rem]',
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
export function SiteHeader({ siteName, logo, navLinks, logoSizes }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const logoWidth = LOGO_WIDTHS[logoSizes[pathname] ?? 'default'];

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      setOpen(false);
      // Return focus to the trigger, or the closing keystroke strands the user.
      triggerRef.current?.focus();
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      {/* min-height, not height: the default lockup is comfortably shorter than
          the token, so pages that position themselves below the header (every
          pageHeader) still get exactly --spacing-header. The homepage's larger
          lockup is allowed to push the bar taller, and nothing there measures
          from the token. */}
      <div className="relative flex min-h-[var(--spacing-header)] items-center justify-between gap-4 px-[var(--spacing-gutter)] py-2">
        {/* Sized to the bar rather than to --spacing-header: the homepage's
            larger lockup pushes the bar past the token, and a fixed-height
            gradient would stop short of the wordmark it is protecting. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.5),transparent)]"
        />

        {/* pl/pt match the hamburger icon's own inset inside its 44px tap target
            ((44-24)/2 = 10 horizontal, (44-16)/2 = 14 vertical). Without them the
            wordmark sits hard against the corner while the icon looks inset,
            because the icon's padding is invisible and the logo has none. */}
        <NextLink
          href="/"
          className="relative inline-block pl-[0.625rem] pt-[0.875rem]"
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
              <span className="mt-0.5 block text-center font-sans text-[length:var(--text-caption)] font-semibold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
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
          onClick={() => setOpen((wasOpen) => !wasOpen)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls={menuId}
          className="relative flex size-[var(--tap-target)] shrink-0 flex-col items-center justify-center gap-[5px]"
        >
          {[0, 1, 2].map((bar) => (
            <span key={bar} aria-hidden="true" className="block h-[2px] w-6 bg-white" />
          ))}
        </button>
      </div>

      <nav
        id={menuId}
        hidden={!open}
        aria-label="Main"
        className="relative mx-[var(--spacing-gutter)] rounded-[var(--radius-card)] bg-surface p-[var(--spacing-gutter)]"
      >
        <ul className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <NextLink
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center font-sans text-[length:var(--text-ui)] text-ink"
              >
                {link.label}
              </NextLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
