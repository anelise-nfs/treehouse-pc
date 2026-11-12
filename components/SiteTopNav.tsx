'use client';

import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import type { Link, SanityImage } from '@/types/content';
import { MenuTrigger } from '@/components/MenuTrigger';

export interface SiteTopNavProps {
  siteName: string;
  logo?: SanityImage;
  /**
   * The links to lay across the bar from md up. Short today — Home, Early Bird
   * and Contact are the only pages that exist — and the bar is built to take
   * the rest as they are built: it wraps to a second row rather than
   * overflowing, so adding Visit, Memberships, Parties and Cafe needs no
   * layout change here.
   *
   * Below md these are not rendered at all. The panel behind the hamburger
   * carries primaryNav instead, exactly as it does on the homepage.
   */
  links: Link[];
  open: boolean;
  onToggle: () => void;
  menuId: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

/**
 * The sub-page site header. Two layouts in one bar, cream in both.
 *
 * From md: the wordmark on the left and the nav laid across the right — the
 * sub-page treatment. This is where it differs from the homepage, deliberately:
 * a sub-page is somewhere you navigate from, so the links are on the surface
 * rather than behind a button.
 *
 * Below md: the homepage's own lockup, hamburger left and wordmark right, at
 * the homepage's sizes. Three labels and a 240px wordmark cannot share 288px of
 * usable width, so a phone was never going to show the links inline — and
 * rather than invent a third thing for small screens, the bar borrows the one
 * that already exists. The header then reads the same on every page of the site
 * at phone width, and the links live in the same slide-in panel they do on the
 * homepage.
 *
 * md is the switch because it is the width where the labels and the wordmark
 * stop competing. It is not lg: tablets have the room, and holding the
 * hamburger until lg would take the nav away from screens that can show it.
 *
 * Sticky rather than fixed: in flow it reserves its own height, so the block
 * below starts under it instead of behind it, and no page has to know the
 * bar's height to avoid it.
 *
 * The hairline along the bottom is the only thing separating the bar from the
 * page once it is stuck over content — both are the same cream — so it is
 * structural, not decoration.
 */
export function SiteTopNav({
  siteName,
  logo,
  links,
  open,
  onToggle,
  menuId,
  triggerRef,
}: SiteTopNavProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-linen">
      {/* Full-bleed with gutter padding rather than the page container: the
          wordmark has to sit on the same left edge as the h1 in the header
          block below it, and that block is full-bleed. Inside container-page
          the two were 40px apart at 1280 and further at wider viewports, where
          the container stops growing and the gutter does not. The overlay
          header pads the same way, for the same reason.

          Two min-heights: below md the bar holds the homepage's lockup and
          takes the homepage's height token, so the two are the same bar. From
          md it is the shorter nav bar.

          Contents are centred at every width. The bar has a fixed height, so
          centring is what actually puts the lockup on its middle line — the
          overlay header does the same below lg, and the two bars have to be
          the same bar there.

          Source order is trigger, wordmark, nav. With justify-between and one
          of the three hidden at any width, that reads left-to-right correctly
          in both layouts — trigger then wordmark on a phone, wordmark then
          nav above md — so the tab order needs no override. */}
      <div className="relative flex min-h-[var(--spacing-header-compact)] items-center justify-between gap-3 px-[var(--spacing-gutter)] py-2 md:min-h-[var(--spacing-topnav)] md:gap-[var(--spacing-gutter)]">
        <div className="md:hidden">
          <MenuTrigger
            open={open}
            onToggle={onToggle}
            menuId={menuId}
            triggerRef={triggerRef}
            // The bar is cream on every sub-page — there is no photograph
            // under it, which is the whole point of this treatment.
            onPhoto={false}
          />
        </div>

        {/* Hidden, not merely stacked behind: on phones the panel covers the
            full width, so the wordmark would otherwise sit on top of it.
            `invisible` rather than opacity so it also leaves the tab order. */}
        <NextLink
          href="/"
          className={`relative flex items-start md:block ${open ? 'invisible sm:visible' : ''}`}
          aria-label={`${siteName} — home`}
        >
          {logo ? (
            // block, not the browser default inline: an inline image sits on a
            // text baseline and carries descender space beneath it, which would
            // push the wordmark off the bar's centre line.
            //
            // w-60 below md is the homepage's own mobile size. From md the bar
            // steps down to its own scale, where the wordmark shares the row
            // with the links rather than owning it.
            <img
              src={logo.url}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className="block w-60 md:w-44 lg:w-52"
            />
          ) : (
            <span className="font-sans text-[length:var(--text-h3)] font-bold text-ink">
              {siteName}
            </span>
          )}
        </NextLink>

        {/* aria-label distinguishes this from the footer's nav landmark. */}
        <nav aria-label="Primary" className="hidden md:block">
          {/* The desktop gap is the one that sets the bar's rhythm. */}
          <ul className="flex flex-wrap items-center gap-x-9 gap-y-0">
            {links.map((link) => {
              // Exact match only. A prefix test would mark Home current on
              // every page, since every path starts with '/'.
              const current = pathname === link.href;

              return (
                <li key={link.href}>
                  <NextLink
                    href={link.href}
                    aria-current={current ? 'page' : undefined}
                    // min-h, not a fixed height: the row has to be able to grow
                    // if a label ever wraps. The 44px floor is the tap target.
                    //
                    // The current page keeps its underline permanently; the
                    // rest take one on hover and on focus-visible, so the cue
                    // is not mouse-only. Ink on linen is 16.78:1 either way —
                    // the underline carries the state, not a colour change
                    // alone, which would be the only signal for a reader who
                    // cannot distinguish them.
                    className={`flex min-h-[var(--tap-target)] items-center font-sans text-[length:var(--text-ui)] font-semibold leading-none text-ink decoration-2 underline-offset-[6px] hover:underline focus-visible:underline ${
                      current ? 'underline decoration-tangerine' : 'no-underline'
                    }`}
                  >
                    {link.label}
                  </NextLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
