import type { Metadata } from 'next';
import { Doodle } from '@/components/doodles/Doodle';
import { DOODLE_SHAPES, type DoodleName } from '@/components/doodles/shapes';

/**
 * Internal reference sheet for the doodle set — not part of the site.
 *
 * Exists so placements can be chosen from the artwork rather than from
 * filenames. Nothing links to it and it is noindex; delete the route whenever
 * it stops being useful, with no consequence elsewhere.
 */
export const metadata: Metadata = {
  title: 'Doodle reference',
  robots: { index: false, follow: false },
};

const NAMES = Object.keys(DOODLE_SHAPES).sort() as DoodleName[];

/** Grouped the way the Phase 2 picker will group them. */
const GROUPS = ['Marks', 'Squiggles', 'Objects'] as const;

export default function DoodleReferencePage() {
  return (
    <main id="main" className="container-page pb-[var(--spacing-section)] pt-[var(--spacing-header)]">
      <h1 className="font-sans text-[length:var(--text-h2)] font-semibold text-ink">
        Doodle reference
      </h1>
      <p className="mt-[var(--spacing-gutter)] font-serif text-[length:var(--text-body)] text-ink">
        {NAMES.length} doodles, each at a consistent size and in the colour it was drawn in. Use
        the name in a block&rsquo;s <code>decorations</code> array in{' '}
        <code>content/pages/home.ts</code>.
      </p>
      <p className="mt-[var(--spacing-gutter)] font-sans text-[length:var(--text-ui)] text-ink-soft">
        slots: top-left · top-right · bottom-left · bottom-right · left · right
        <span className="block">sizes: sm 48px · md 80px (default) · lg 112px</span>
        <span className="block">
          colours: pine · mint · tangerine · flamingo · seafoam · sunshine · lime · tomato · sky ·
          ocean
        </span>
      </p>

      {GROUPS.map((group) => (
        <section key={group}>
          <h2 className="mt-[var(--spacing-section)] font-sans text-[length:var(--text-h3)] font-semibold text-ink">
            {group}
          </h2>
          <ul className="mt-[var(--spacing-block)] grid grid-cols-2 gap-[var(--spacing-block)] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {NAMES.filter((name) => DOODLE_SHAPES[name].group === group).map((name) => (
          <li
            key={name}
            className="flex flex-col items-center gap-[var(--spacing-gutter)] rounded-[var(--radius-card)] bg-surface-alt p-[var(--spacing-gutter)]"
          >
            <span className="text-center font-sans text-[length:var(--text-ui)] font-semibold text-ink">
              {DOODLE_SHAPES[name].label}
            </span>
            {/* Fixed box so every doodle is compared at the same scale, whatever
                its own aspect ratio. */}
            <span className="flex h-24 w-24 items-center justify-center">
              <Doodle name={name} className="max-h-24 w-auto max-w-24" />
            </span>
            <code className="text-center font-sans text-[length:var(--text-caption)] text-ink-soft">
              {name} · {DOODLE_SHAPES[name].defaultColor}
            </code>
          </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
