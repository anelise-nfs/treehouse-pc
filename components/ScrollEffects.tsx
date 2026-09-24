'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * The page's scroll motion, in one place.
 *
 * Three effects, all opt-in via data attributes so the blocks themselves stay
 * server components and carry nothing but a marker:
 *
 *   [data-reveal]        fade and rise once as it enters the viewport
 *   [data-wipe]          a band's colour fill wipes in, alternating left/right
 *   [data-doodle-enter]  a doodle settles into place, as if just drawn
 *
 * Two rules this is built around:
 *
 * 1. Content is visible without JavaScript. The hiding styles are scoped to
 *    `.js-motion` on <html>, which only this component adds — so if the script
 *    never runs, every element simply renders in its final state. The initial
 *    pass also reveals anything already on screen *before* enabling that class,
 *    so there is no flash of hidden content above the fold.
 *
 * 2. Nothing here moves layout. Reveals and wipes use opacity, transform and
 *    clip; parallax writes to a custom property consumed by `translate`, which
 *    composes with the Tailwind positioning already on the doodle rather than
 *    overwriting it.
 */
export function ScrollEffects() {
  // Re-runs on every route change. This component lives in the root layout,
  // which the App Router keeps mounted across client-side navigation — so
  // without this dependency the effect would run once, on the first page only.
  // The next page's content would then be hidden by `.js-motion` with nothing
  // observing it, and would stay invisible until a hard refresh.
  const pathname = usePathname();

  useEffect(() => {
    // Respect the OS setting by doing nothing at all: no hidden states, no
    // observers, no scroll handler. Everything stays in its final position.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const root = document.documentElement;
    const reveals = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
    const wipes = [...document.querySelectorAll<HTMLElement>('[data-wipe]')];
    const doodles = [...document.querySelectorAll<HTMLElement>('[data-doodle-enter]')];

    // Bands alternate direction down the page. Assigned here rather than
    // authored, so an editor never has to think about it.
    wipes.forEach((el, index) => {
      el.dataset.wipeFrom = index % 2 === 0 ? 'left' : 'right';
    });

    const onScreen = (el: HTMLElement) => {
      const { top, bottom } = el.getBoundingClientRect();
      return top < window.innerHeight && bottom > 0;
    };

    // Mark what is already visible BEFORE the hiding styles switch on.
    [...reveals, ...wipes, ...doodles].forEach((el) => {
      if (onScreen(el)) el.dataset.shown = 'true';
    });
    root.classList.add('js-motion');

    // Fires once: a second pass down the page should be quiet.
    const watch = (elements: HTMLElement[], rootMargin: string) => {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            (entry.target as HTMLElement).dataset.shown = 'true';
            observer.unobserve(entry.target);
          }
        },
        { rootMargin },
      );
      for (const el of elements) {
        if (el.dataset.shown !== 'true') observer.observe(el);
      }
      return observer;
    };

    // Sections start as they clear the bottom edge. Doodles wait until they are
    // well inside the viewport: they are small, and firing at the edge means the
    // motion is over before they are somewhere you are actually looking.
    const observers = [
      watch([...reveals, ...wipes], '0px 0px -12% 0px'),
      watch(doodles, '0px 0px -46% 0px'),
    ];

    return () => {
      for (const observer of observers) observer.disconnect();
      root.classList.remove('js-motion');
    };
  }, [pathname]);

  return null;
}
