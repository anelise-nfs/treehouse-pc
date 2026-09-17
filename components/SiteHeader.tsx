'use client';

import { useEffect, useId, useRef, useState } from 'react';
import NextLink from 'next/link';
import type { Link, SanityImage } from '@/types/content';

export interface SiteHeaderProps {
  siteName: string;
  logo?: SanityImage;
  navLinks: Link[];
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
export function SiteHeader({ siteName, logo, navLinks }: SiteHeaderProps) {
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
    <header className="absolute inset-x-0 top-0 z-50">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.35),transparent)]"
      />

      <div className="relative flex items-start justify-between gap-4 px-[var(--spacing-gutter)] py-[var(--spacing-gutter)]">
        <NextLink href="/" className="inline-block" aria-label={`${siteName} — home`}>
          {logo ? (
            <img
              src={logo.url}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className="w-40 sm:w-56"
            />
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
          className="flex size-[var(--tap-target)] shrink-0 flex-col items-center justify-center gap-[5px]"
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
