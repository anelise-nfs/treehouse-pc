import type { PressItem, PressListBlock } from '@/types/content';
import { CONTENT_INSET } from '@/components/layout';
import { DecorationLayer } from '@/components/doodles/DecorationLayer';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * 'November 2, 2026' from '2026-11-02', 'September 2026' from '2026-09'.
 *
 * Parsed from the string's own parts rather than through `new Date()`, which
 * reads a bare 'YYYY-MM-DD' as UTC midnight and then renders the day before in
 * every timezone behind Greenwich — Park City is seven hours behind, so every
 * date on this page would have been off by one. Hand-formatting also keeps the
 * output identical between the build and the browser, which `toLocaleDateString`
 * does not guarantee across runtimes.
 *
 * An unparseable value renders as itself rather than as 'Invalid Date'.
 */
function formatPressDate(date: string): string {
  const [year, month, day] = date.split('-');
  const name = MONTHS[Number(month) - 1];
  if (!year || !name) return date;
  return day ? `${name} ${Number(day)}, ${year}` : `${name} ${year}`;
}

/**
 * One article. The whole card is the link, so the target is the item rather
 * than a 'read more' tacked onto the end of it.
 *
 * The accessible name is the outlet, headline and date together, in that
 * order, which is enough to tell two links apart out of context — the thing a
 * bare 'read more' fails at.
 */
function PressRow({ item }: { item: PressItem }) {
  return (
    <li>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-[var(--radius-card)] py-[var(--spacing-gutter)] transition-colors duration-150 ease-out"
      >
        {item.logo ? (
          <img
            src={item.logo.url}
            alt={item.logo.alt}
            width={item.logo.width}
            height={item.logo.height}
            className="mb-3 h-8 w-auto"
          />
        ) : null}

        {/* Pine, not lime: the same pairing the membership perks use, and the
            same reason — lime on linen is 3.02:1 and fails at this size, pine
            is 6.42:1. */}
        <p className="font-sans text-[length:var(--text-ui)] font-medium text-pine">
          {item.outlet}
        </p>

        {/* Underlined on hover and on focus together, so a keyboard user gets
            the same signal as a mouse user. The row is not a button, so it
            does not take the button treatment. */}
        <p className="mt-1 font-serif text-[length:var(--text-lead)] text-ink underline-offset-4 group-hover:underline group-focus-visible:underline">
          {item.headline}
        </p>

        {item.excerpt ? (
          <p className="mt-2 max-w-[68ch] font-serif text-[length:var(--text-body)] text-ink">
            {item.excerpt}
          </p>
        ) : null}

        {/* dateTime carries the machine-readable value; the visible text is the
            formatted one. 'YYYY-MM' is a valid <time> value in its own right. */}
        <time
          dateTime={item.date}
          className="mt-2 block font-sans text-[length:var(--text-caption)] text-ink-soft"
        >
          {formatPressDate(item.date)}
        </time>
      </a>
    </li>
  );
}

/**
 * The press list on /press.
 *
 * A plain stack rather than a grid: these are a handful of links out, and the
 * headline is the thing worth reading, so each gets a full line's width.
 * Dividers rather than cards — a card implies a destination on this site, and
 * every one of these leaves it.
 *
 * `items` arrives already sorted from lib/content.ts. Sorting is not repeated
 * here: in Phase 2 the order comes from the GROQ query, and a component that
 * re-sorted would quietly override it.
 */
export function PressList({ heading, items, decorations, anchorId }: PressListBlock) {
  return (
    <section
      id={anchorId}
      data-reveal
      className={`container-page ${CONTENT_INSET} relative my-[var(--spacing-section)]`}
    >
      <DecorationLayer decorations={decorations} />

      {heading ? (
        <h2 className="mb-[var(--spacing-block)] text-center font-script text-[length:var(--text-script-sm)] leading-[var(--leading-heading)] text-ink">
          {heading}
        </h2>
      ) : null}

      {/* Nothing but the heading when there is no coverage yet, rather than an
          empty bordered box. */}
      {items.length > 0 ? (
        // ink/10, the hairline SiteHeader and SiteTopNav already use, rather
        // than --color-placeholder-border: that token exists to match the grey
        // baked into the placeholder image SVGs and is documented to retire
        // with the last of them, which would take these dividers with it.
        <ul className="divide-y divide-ink/10 border-y border-ink/10">
          {items.map((item) => (
            <PressRow key={item._id} item={item} />
          ))}
        </ul>
      ) : null}
    </section>
  );
}
