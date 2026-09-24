'use client';

import { useEffect, useId, useRef, useState } from 'react';
import NextLink from 'next/link';
import type { SanityImage } from '@/types/content';
import { SiteHeader, type SiteHeaderProps } from '@/components/SiteHeader';

/**
 * Accent dot per nav item, cycled by index. Decorative only — several of these
 * fail AA behind text, which is why the label stays ink on seafoam (11.72:1).
 */
const ITEM_ACCENTS = ['bg-tangerine', 'bg-ocean', 'bg-sunshine', 'bg-flamingo', 'bg-lime'];

export interface SiteShellProps extends SiteHeaderProps {
  children: React.ReactNode;
  /** Single-colour wordmark, shown at the foot of the open menu panel. */
  logoWhite?: SanityImage;
}

/**
 * Owns the menu's open state, which lives here rather than in SiteHeader because
 * opening the menu squeezes the whole page — and the content is a sibling of the
 * header, not its child.
 *
 * Squeeze, not slide: margin-right keeps everything on-screen, at the cost of a
 * visible re-wrap. A transform would animate better but clip the left edge.
 */
export function SiteShell({ children, logoWhite, ...headerProps }: SiteShellProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);

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
    <>
      {/* relative is load-bearing: SiteHeader is absolute, and without a
          positioned ancestor it would stay full-width while the content squeezed. */}
      <div
        className={`relative transition-[margin-right] duration-300 ease-out ${
          open ? 'sm:mr-[var(--spacing-menu)]' : 'mr-0'
        }`}
      >
        <SiteHeader
          {...headerProps}
          open={open}
          menuId={menuId}
          triggerRef={triggerRef}
          onToggle={() => setOpen((wasOpen) => !wasOpen)}
        />
        {children}
      </div>

      {/* Always rendered so it can animate; `inert` keeps the off-screen links
          out of the tab order, which `hidden` would do at the cost of the transition. */}
      <nav
        id={menuId}
        inert={!open}
        aria-label="Main"
        className={`fixed inset-y-0 right-0 z-40 flex h-dvh w-full flex-col bg-seafoam transition-transform duration-300 ease-out sm:w-[var(--spacing-menu)] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Mobile clears the header, which overlays the full-width panel there.
            From sm the first label aligns with the hamburger's bars: the calc
            subtracts the label's centring offset inside its 44px row, which the
            link's explicit leading-[1.5] makes a known quantity. */}
        <ul className="flex flex-col gap-1 px-[var(--spacing-gutter)] pt-[var(--spacing-header)] sm:pt-[calc(var(--spacing-menu-top)-(var(--tap-target)-var(--text-ui)*1.5)/2)]">
          {headerProps.navLinks.map((link, index) => (
            <li key={link.href}>
              <NextLink
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex min-h-[var(--tap-target)] items-center gap-3 font-sans text-[length:var(--text-ui)] font-semibold leading-[1.5] text-ink no-underline"
              >
                <span
                  aria-hidden="true"
                  className={`size-2.5 shrink-0 rounded-full ${
                    ITEM_ACCENTS[index % ITEM_ACCENTS.length]
                  }`}
                />
                {link.label}
              </NextLink>
            </li>
          ))}
        </ul>

        {logoWhite ? (
          <img
            src={logoWhite.url}
            alt=""
            aria-hidden="true"
            width={logoWhite.width}
            height={logoWhite.height}
            className="mt-auto w-40 self-center px-[var(--spacing-gutter)] pb-[var(--spacing-section)] sm:w-full sm:max-w-[9rem]"
          />
        ) : null}
      </nav>
    </>
  );
}
