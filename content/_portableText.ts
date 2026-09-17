/**
 * Fixture helpers for building portable text by hand.
 *
 * Internal to /content/ and deleted along with it in Phase 2, when Sanity
 * produces these structures itself. Underscore-prefixed so it is obviously not
 * part of the content surface.
 */
import type { LinkKind, PortableTextBlock, PortableTextStyle } from '@/types/content';

type Paragraph = string | { style: PortableTextStyle; text: string };

/**
 * Keys are derived from the text rather than hand-written so they stay stable
 * across edits elsewhere in the same array. Sanity generates real ones.
 */
function digest(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i += 1) {
    h = ((h << 5) + h + input.charCodeAt(i)) >>> 0;
  }
  return h.toString(36);
}

export function pt(...paragraphs: Paragraph[]): PortableTextBlock[] {
  return paragraphs.map((paragraph, index) => {
    const style: PortableTextStyle = typeof paragraph === 'string' ? 'normal' : paragraph.style;
    const text = typeof paragraph === 'string' ? paragraph : paragraph.text;
    const key = `${index}${digest(text)}`;

    return {
      _type: 'block',
      _key: `b${key}`,
      style,
      children: [{ _type: 'span', _key: `s${key}`, text, marks: [] }],
      markDefs: [],
    };
  });
}

/** A paragraph that is entirely one link — used for mailto: and tel: contact details. */
export function ptLink(text: string, href: string, kind: LinkKind = 'external'): PortableTextBlock {
  const key = digest(`${text}${href}`);

  return {
    _type: 'block',
    _key: `b${key}`,
    style: 'normal',
    children: [{ _type: 'span', _key: `s${key}`, text, marks: [`l${key}`] }],
    markDefs: [{ _type: 'link', _key: `l${key}`, href, kind }],
  };
}

export const h2 = (text: string) => ({ style: 'h2' as const, text });
export const h3 = (text: string) => ({ style: 'h3' as const, text });
