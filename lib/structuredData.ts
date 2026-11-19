import type { FaqSection, PortableTextBlock } from '@/types/content';

/**
 * Portable text as a single plain string.
 *
 * Structured data carries meaning, not markup: schema.org's `acceptedAnswer`
 * takes text, and a consumer that renders it is not required to parse HTML out
 * of it. Links lose their href here, which is correct — the answer on the page
 * keeps them, and this is the machine-readable restatement.
 *
 * Blocks join with a space rather than a newline because the result is one
 * value in a JSON document, not a paragraph someone reads.
 */
function toPlainText(blocks: PortableTextBlock[]): string {
  return blocks
    .map((block) => block.children.map((span) => span.text).join(''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * FAQPage JSON-LD covering every question on the page.
 *
 * Returned as a string ready for `dangerouslySetInnerHTML`, with `<` escaped
 * to `<`. That escape is the whole reason this returns a string rather
 * than an object: a `</script>` appearing inside any answer would otherwise
 * close the tag early and drop the rest of the document into the page as
 * markup. None of the current answers contain one; the escape means none ever
 * can.
 *
 * Every section's items are included. Google restricted FAQ *rich results* to
 * government and health sites in 2023, so this is unlikely to draw an expanded
 * snippet — but it remains valid schema.org that other consumers read, and it
 * costs one script tag.
 */
export function faqPageJsonLd(sections: FaqSection[]): string {
  const mainEntity = sections.flatMap((section) =>
    section.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: toPlainText(item.answer),
      },
    })),
  );

  const document = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
  };

  return JSON.stringify(document).replace(/</g, '\\u003c');
}
