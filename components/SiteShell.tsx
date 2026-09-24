'use client';

import { useEffect, useId, useRef, useState } from 'react';
import NextLink from 'next/link';
import type { SanityImage } from '@/types/content';
import { SiteHeader, type SiteHeaderProps } from '@/components/SiteHeader';
import { Doodle } from '@/components/doodles/Doodle';

/**
 * Accent per nav item, cycled by index: the dot beside the label, and the
 * underline that matches it on hover.
 *
 * Both classes are written out rather than derived from a colour name, because
 * Tailwind only emits classes it can see in the source.
 *
 * Decorative only — several of these fail AA behind text, which is why the label
 * itself stays ink on seafoam (11.72:1). An underline is a mark rather than the
 * text, so a low-contrast one costs no legibility.
 */
interface NavAccent {
  dot: string;
  underline: string;
}

/** Typed as non-empty so the cycling lookup below needs no assertion. */
const ITEM_ACCENTS: readonly [NavAccent, ...NavAccent[]] = [
  { dot: 'bg-tangerine', underline: 'decoration-tangerine' },
  { dot: 'bg-ocean', underline: 'decoration-ocean' },
  { dot: 'bg-sunshine', underline: 'decoration-sunshine' },
  { dot: 'bg-flamingo', underline: 'decoration-flamingo' },
  { dot: 'bg-lime', underline: 'decoration-lime' },
];

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
        <ul className="flex flex-col gap-3 px-[var(--spacing-gutter)] pt-[var(--spacing-header)] sm:gap-1 sm:pt-[calc(var(--spacing-menu-top)-(var(--tap-target)-var(--text-ui)*1.5)/2)]">
          {headerProps.navLinks.map((link, index) => {
            const accent = ITEM_ACCENTS[index % ITEM_ACCENTS.length] ?? ITEM_ACCENTS[0];

            return (
              <li key={link.href}>
                <NextLink
                  href={link.href}
                  onClick={() => setOpen(false)}
                  // The underline picks up the dot's colour. Paired with
                  // focus-visible so it is not mouse-only.
                  className={`flex min-h-[var(--tap-target)] items-center gap-3 font-sans text-[length:var(--text-lead)] font-semibold leading-[1.7] text-ink no-underline decoration-2 underline-offset-4 hover:underline focus-visible:underline sm:text-[length:var(--text-ui)] sm:leading-[1.5] ${accent.underline}`}
                >
                  <span
                    aria-hidden="true"
                    className={`size-2.5 shrink-0 rounded-full ${accent.dot}`}
                  />
                  {link.label}
                </NextLink>
              </li>
            );
          })}
        </ul>

        {/* Hardcoded rather than a `decorations` entry: the panel is site chrome,
            not a content block, and exposing it to the CMS would mean giving an
            author a decoration surface attached to nav management. Static, with
            no entrance animation — the panel slides in and carries it along.

            From sm only: on a phone the panel is a full-screen takeover carrying
            the wordmark, and the butterfly would be competing decoration. It
            belongs to the narrow desktop strip, which is otherwise empty. */}
        <Doodle
          name="butterfly"
          color="flamingo"
          className="pointer-events-none absolute bottom-6 right-6 hidden w-18 sm:block"
        />

        {logoWhite ? (
          <img
            src={logoWhite.url}
            alt=""
            aria-hidden="true"
            width={logoWhite.width}
            height={logoWhite.height}
            // Phone only: from sm the panel is a narrow strip beside the page, where a
            // wordmark has no room and nothing to sit against. It belongs to the
            // full-screen takeover, not the strip.
            // w-56 is 224px of box, but the gutter padding sits inside it
            // (border-box), so the wordmark itself renders 192px wide.
            className="mt-auto w-56 self-center px-[var(--spacing-gutter)] pb-[var(--spacing-section)] sm:hidden"
          />
        ) : null}
      </nav>
    </>
  );
}
