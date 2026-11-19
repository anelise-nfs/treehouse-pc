import type { FaqAccordionBlock, FaqSection } from '@/types/content';
import { SCRIPT_HEADING_COLOR } from '@/components/blocks/ImageTextSplit';
import { PortableText } from '@/components/PortableText';
import { CONTENT_INSET } from '@/components/layout';
import { DecorationLayer } from '@/components/doodles/DecorationLayer';

/**
 * One collapsible section.
 *
 * Native `<details>`/`<summary>`, not a hand-built disclosure. It is keyboard
 * operable, announced as expanded or collapsed, and findable by the browser's
 * own in-page search — all without a line of JavaScript, which also means it
 * works on the prerendered HTML before hydration and on a visitor who never
 * gets it. A custom accordion would need aria-expanded, aria-controls, key
 * handling and a state hook to arrive at the same place.
 *
 * The heading sits inside the summary rather than wrapping it: `<h2><summary>`
 * is invalid, and a summary with no heading leaves the page's outline with a
 * gap where its sections should be.
 */
function Section({ section }: { section: FaqSection }) {
  return (
    <details className="group border-b border-ink/10 py-[var(--spacing-gutter)]">
      {/* list-none plus the webkit pseudo-element: the two rules between them
          remove the default disclosure triangle on every engine. The chevron
          below replaces it, rotated by the group's open state. */}
      <summary className="flex cursor-pointer list-none items-center justify-between gap-[var(--spacing-gutter)] [&::-webkit-details-marker]:hidden">
        {/* --text-script-badge, a step down from --text-script-sm: 38px against
            43px at desktop, identical at the 28px floor both clamp to. That
            floor is load-bearing twice over — it is the script face's minimum,
            and it is what keeps these headings large text, which is the only
            reason the lighter colours below are legal at all.

            Colour comes from the same map the image/text splits use, authored
            per section in content/faqs.ts. Unset falls back to ink. */}
        <h2
          className={`font-script text-[length:var(--text-script-badge)] leading-[var(--leading-heading)] ${
            section.titleColor ? SCRIPT_HEADING_COLOR[section.titleColor] : 'text-ink'
          }`}
        >
          {section.title}
        </h2>

        {/* aria-hidden: the summary already announces its own expanded state,
            so this is decoration repeating it visually. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className={`size-6 shrink-0 fill-none stroke-current transition-transform duration-150 ease-out group-open:rotate-180 ${
            section.titleColor ? SCRIPT_HEADING_COLOR[section.titleColor] : 'text-ink'
          }`}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m5 9 7 7 7-7" />
        </svg>
      </summary>

      <ul className="mt-[var(--spacing-block)] flex flex-col gap-[var(--spacing-block)]">
        {section.items.map((item) => (
          <li key={item._id}>
            {/* h3 under the section's h2, under the page's h1. */}
            <h3 className="font-sans text-[length:var(--text-ui)] font-medium text-pine">
              {item.question}
            </h3>

            {/* space-y, because PortableText emits a flat run of siblings and
                sets no margins of its own. [&_a] underlines links in the
                answers — colour alone cannot mark one. */}
            <div className="mt-2 space-y-[var(--spacing-gutter)] [&_a]:underline [&_a]:underline-offset-2">
              <PortableText
                blocks={item.answer}
                className="max-w-[68ch] font-serif text-[length:var(--text-body)] text-ink"
              />
            </div>
          </li>
        ))}
      </ul>
    </details>
  );
}

/**
 * The FAQ, grouped into collapsible sections.
 *
 * Every section starts collapsed, so the page opens on the five section
 * headings and nothing else — the whole shape of the FAQ on one screen, with
 * the choice of where to go left to the reader.
 *
 * Open state is the browser's, not React's: these are independent disclosures,
 * not a one-at-a-time accordion. Closing a section someone opened in order to
 * open another is a behaviour people have to fight when they want two answers
 * side by side, and nothing here is long enough to need it.
 *
 * Sections arrive assembled and ordered from lib/content.ts. Nothing is sorted
 * or grouped here: in Phase 2 that ordering comes from the query, and a
 * component that re-derived it would quietly override the author.
 */
export function FaqAccordion({
  heading,
  intro,
  sections,
  decorations,
  anchorId,
}: FaqAccordionBlock) {
  return (
    <section
      id={anchorId}
      data-reveal
      /* Split rather than `my-`, and a bigger bottom than top: the last
         section's bottom border runs the full content width, which put a hard
         line a short distance above the footer's pine edge and read as two
         rules stacked. 1.6x separates them. Written as mt/mb rather than my
         plus an mb override so neither depends on Tailwind's ordering.

         Derived from --spacing-section rather than a bare value, the same way
         ImageTextSplit builds its own larger gap. */
      className={`container-page ${CONTENT_INSET} relative mt-[var(--spacing-section)] mb-[calc(var(--spacing-section)*1.6)]`}
    >
      <DecorationLayer decorations={decorations} />

      {heading ? (
        <h2 className="mb-[var(--spacing-block)] text-center font-script text-[length:var(--text-script-sm)] leading-[var(--leading-heading)] text-ink">
          {heading}
        </h2>
      ) : null}

      {intro ? (
        <div className="measure mx-auto mb-[var(--spacing-block)] space-y-[var(--spacing-gutter)] text-center [&_a]:underline [&_a]:underline-offset-2">
          <PortableText
            blocks={intro}
            className="font-serif text-[length:var(--text-lead)] text-ink"
          />
        </div>
      ) : null}

      {/* A top border on the wrapper pairs with each section's bottom border,
          so the first section is enclosed like the rest rather than opening on
          a bare edge. */}
      {sections.length > 0 ? (
        <div className="border-t border-ink/10">
          {sections.map((section) => (
            <Section key={section._key} section={section} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
