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
  PortableTextTable,
  PortableTextMarkDef,
  PortableTextSpan,
  PortableTextStyle,
} from '@/types/content';

/**
 * A run of text inside a paragraph. The object form carries a link, which is
 * the only inline mark the fixtures need so far — the renderer resolves it
 * through the paragraph's markDefs, the same way Sanity will.
 */
type SpanInput =
  | string
  | { text: string; href: string; kind?: LinkKind; newTab?: boolean; bold?: boolean }
  /**
   * A bold run. `strong` is a decoration rather than an annotation, so unlike a
   * link it needs no markDef — the span just carries the mark name, which the
   * renderer has always understood.
   *
   * Needed for a legal document written with run-in heads ('**3.1 Required
   * Initial Annual Term.** You agree to...'): the bold lead and the sentence
   * after it are one paragraph in the source, and splitting them into a heading
   * and a paragraph would restructure the agreement rather than render it.
   */
  | { text: string; bold: true };

/**
 * A paragraph: a bare string for the common case, an object to set its style,
 * or an array of runs when part of it is a link.
 */
type Paragraph =
  | string
  | { style: PortableTextStyle; text: string }
  | SpanInput[]
  /** One bulleted item. Consecutive ones are grouped into a list by the renderer. */
  | { bullet: SpanInput[] | string };

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

    // A bullet is any paragraph with the marker set; the runs of them are
    // assembled into <ul>s by the renderer, not here, because portable text
    // has no list container to build.
    if (typeof paragraph === 'object' && 'bullet' in paragraph) {
      const runs = Array.isArray(paragraph.bullet) ? paragraph.bullet : [paragraph.bullet];
      return { ...mixed(runs, index), listItem: 'bullet' as const, level: 1 };
    }

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

    const decorations = run.bold ? ['strong'] : [];

    // A run with no href is emphasis only and needs no markDef.
    if (!('href' in run)) {
      return { _type: 'span', _key: spanKey, text: run.text, marks: decorations };
    }

    const markKey = `m${key}-${i}`;
    markDefs.push({
      _type: 'link',
      _key: markKey,
      href: run.href,
      kind: run.kind ?? 'external',
      ...(run.newTab ? { newTab: true } : {}),
    });

    return { _type: 'span', _key: spanKey, text: run.text, marks: [...decorations, markKey] };
  });

  return { _type: 'block', _key: `b${key}`, style: 'normal', children, markDefs };
}

/**
 * A table, built separately from the prose around it and spliced in.
 *
 * A standalone builder rather than another `pt()` paragraph form, because a
 * table is not a portable-text block and `pt()` returns blocks. Compose a body
 * that mixes the two by spreading:
 *
 *     body: [...pt(before), table(head, rows), ...pt(after)]
 *
 * Keys are derived from the contents, like `pt()`'s, so they survive edits
 * elsewhere in the same body.
 */
export function table(head: string[], rows: string[][]): PortableTextTable {
  const key = digest([head.join('|'), ...rows.map((row) => row.join('|'))].join('//'));

  return {
    _type: 'table',
    _key: `t${key}`,
    head,
    rows: rows.map((cells, index) => ({ _key: `t${key}r${index}`, cells })),
  };
}
