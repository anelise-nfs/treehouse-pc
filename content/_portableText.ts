/**
 * Fixture helpers for building portable text by hand.
 *
 * Internal to /content/ and deleted along with it in Phase 2, when Sanity
 * produces these structures itself. Underscore-prefixed so it is obviously not
 * part of the content surface.
 */
import type {
  LinkKind,
  PortableTextBlock,
  PortableTextMarkDef,
  PortableTextSpan,
  PortableTextStyle,
} from '@/types/content';

/**
 * A run of text inside a paragraph. The object form carries a link, which is
 * the only inline mark the fixtures need so far — the renderer resolves it
 * through the paragraph's markDefs, the same way Sanity will.
 */
type SpanInput = string | { text: string; href: string; kind?: LinkKind; newTab?: boolean };

/**
 * A paragraph: a bare string for the common case, an object to set its style,
 * or an array of runs when part of it is a link.
 */
type Paragraph = string | { style: PortableTextStyle; text: string } | SpanInput[];

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
    if (Array.isArray(paragraph)) return mixed(paragraph, index);

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

/**
 * A paragraph whose runs are not all plain text.
 *
 * Each linked run gets a markDef and a mark pointing at it by `_key`, which is
 * the indirection portable text uses for annotations — the span says which
 * mark applies, the block says what that mark is.
 */
function mixed(runs: SpanInput[], index: number): PortableTextBlock {
  const key = `${index}${digest(runs.map((r) => (typeof r === 'string' ? r : r.text)).join(''))}`;
  const markDefs: PortableTextMarkDef[] = [];

  const children: PortableTextSpan[] = runs.map((run, i) => {
    const spanKey = `s${key}-${i}`;
    if (typeof run === 'string') {
      return { _type: 'span', _key: spanKey, text: run, marks: [] };
    }

    const markKey = `m${key}-${i}`;
    markDefs.push({
      _type: 'link',
      _key: markKey,
      href: run.href,
      kind: run.kind ?? 'external',
      ...(run.newTab ? { newTab: true } : {}),
    });

    return { _type: 'span', _key: spanKey, text: run.text, marks: [markKey] };
  });

  return { _type: 'block', _key: `b${key}`, style: 'normal', children, markDefs };
}
