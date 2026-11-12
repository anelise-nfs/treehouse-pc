'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import type { HeaderVariant, Link, SanityImage } from '@/types/content';
import { SiteHeader, type SiteHeaderProps } from '@/components/SiteHeader';
import { SiteTopNav } from '@/components/SiteTopNav';
import { NewsletterDialog } from '@/components/NewsletterDialog';
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
  /**
   * Which header each route wears, keyed by path. Authored per page and passed
   * down from the root layout, which has no access to the active route.
   *
   * An unlisted path falls back to 'overlay' — the treatment that existed
   * before this map did, so a route outside the content layer (the /doodles
   * scratch page) keeps behaving as it always has.
   */
  headerVariants: Record<string, HeaderVariant>;
  /** The sub-page bar's links. Unused by the overlay header. */
  topNav: Link[];
}

/**
 * Owns the menu's open state, which lives here rather than in SiteHeader because
 * opening the menu squeezes the whole page — and the content is a sibling of the
 * header, not its child.
 *
 * Squeeze, not slide: margin-right keeps everything on-screen, at the cost of a
 * visible re-wrap. A transform would animate better but clip the left edge.
 */
export function SiteShell({
  children,
  logoWhite,
  headerVariants,
  topNav,
  ...headerProps
}: SiteShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const variant = headerVariants[pathname] ?? 'overlay';

  /* Closing always returns focus to the trigger, or whoever closed the panel
     with a keyboard is left with focus on nothing. */
  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') close();
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  /* Below sm the panel is drawn over the trigger, so leaving focus on it
     would leave it on something nobody can see — the panel's close button is
     the visible equivalent. offsetParent is the test for "is this rendered",
     which is false for the sm:hidden button at wider widths, where the
     trigger stays visible and focus is better left alone. */
  useEffect(() => {
    if (!open) return;
    if (closeRef.current?.offsetParent) closeRef.current.focus();
  }, [open]);

  /* Both variants get the panel now. The sub-page bar shows its links inline
     from md, but below that it falls back to the homepage's hamburger, and
     that button needs the same panel behind it — so the drawer, the open
     state and the squeeze wrapper are shared rather than branched.

     The squeeze animates margin-left, not a transform. That matters here: a
     transform on this wrapper would make it the containing block for the
     sticky bar inside it and quietly stop the bar sticking. A margin does not. */
  const toggle = () => setOpen((wasOpen) => !wasOpen);

  return (
    <>
      {/* relative is load-bearing: SiteHeader is absolute, and without a
          positioned ancestor it would stay full-width while the content squeezed. */}
      <div
        className={`relative transition-[margin-left] duration-300 ease-out ${
          open ? 'sm:ml-[var(--spacing-menu)]' : 'ml-0'
        }`}
      >
        {variant === 'topbar' ? (
          <SiteTopNav
            siteName={headerProps.siteName}
            logo={headerProps.logo}
            links={topNav}
            open={open}
            menuId={menuId}
            triggerRef={triggerRef}
            onToggle={toggle}
          />
        ) : (
          <SiteHeader
            {...headerProps}
            open={open}
            menuId={menuId}
            triggerRef={triggerRef}
            onToggle={toggle}
          />
        )}
        {children}
      </div>

      {/* Mounted once per page, outside the squeeze wrapper: a native dialog
          renders in the browser's top layer, so its position does not depend
          on where it sits in the tree, and keeping it out of the transformed
          wrapper keeps it that way. */}
      <NewsletterDialog />

      {/* Always rendered so it can animate; `inert` keeps the off-screen links
          out of the tab order, which `hidden` would do at the cost of the transition. */}
      <nav
        id={menuId}
        inert={!open}
        aria-label="Main"
        // z above the header, which is z-50. Below sm this panel is the full
        // screen, and at z-40 the header's solid cream bar painted straight
        // over the top of it. From sm the panel is a strip beside a page that
        // has been pushed right, so nothing overlaps either way and the
        // higher z costs nothing.
        className={`fixed inset-y-0 left-0 z-[60] flex h-dvh w-full flex-col bg-seafoam transition-transform duration-300 ease-out sm:w-[var(--spacing-menu)] ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Below sm the panel covers the header, so the only way back out is
            here. From sm the header's own trigger is still visible beside the
            panel and already reads "Close menu", so a second control would be
            redundant.

            Positioned rather than in flow so it cannot push the first link
            down, and matched to the header's own top inset so it sits where
            the wordmark was. */}
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Close menu"
          // --text-display, not a heading step: the glyph is the whole
          // control, so it carries the weight a label would. The 44px minimum
          // still sets the tap target, which the glyph now nearly fills.
          className="absolute right-[calc(var(--spacing-gutter)-0.5rem)] top-2 flex min-h-[var(--tap-target)] min-w-[var(--tap-target)] cursor-pointer items-center justify-center text-[length:var(--text-display)] leading-none text-ink sm:hidden"
        >
          <span aria-hidden="true">&times;</span>
        </button>

        {/* Below sm the panel covers the header rather than starting beneath
            it, so this padding is clearing the panel's own close button — the
            header token is still the right number, because the button is
            placed to match it.

            From sm the first label aligns with the hamburger's bars: the calc
            subtracts the label's centring offset inside its 44px row, which the
            link's explicit leading-[1.5] makes a known quantity. */}
        <ul className="flex flex-col gap-3 px-[var(--spacing-gutter)] pt-[var(--spacing-header-compact)] sm:gap-1 sm:pt-[calc(var(--spacing-menu-top)-(var(--tap-target)-var(--text-ui)*1.5)/2)]">
          {headerProps.navLinks.map((link, index) => {
            const accent = ITEM_ACCENTS[index % ITEM_ACCENTS.length] ?? ITEM_ACCENTS[0];

            return (
              <li key={link.href}>
                <NextLink
                  href={link.href}
                  // Dismiss only — not `close`, which also returns focus to
                  // the trigger. On an anchor link that would scroll back to
                  // the header immediately after jumping to the section.
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
            the wordmark, and the mark would be competing decoration. It
            belongs to the narrow desktop strip, which is otherwise empty. */}
        <Doodle
          name="rainbow"
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
