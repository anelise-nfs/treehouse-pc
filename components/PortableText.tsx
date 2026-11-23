import NextLink from 'next/link';
import type {
  PortableTextBlock,
  PortableTextContent,
  PortableTextSpan,
  PortableTextTable,
} from '@/types/content';
import { NewsletterTrigger } from '@/components/NewsletterTrigger';

/**
 * Minimal portable text renderer, hand-written rather than pulled from a
 * package — see ARCHITECTURE.md → Dependency discipline. It covers what the
 * content types allow and nothing more.
 *
 * Renders nothing at all for an empty array, so a block with no body does not
 * leave an empty element behind.
 */
export interface PortableTextProps {
  blocks?: PortableTextContent[];
  className?: string;
  /**
   * Applied to the `<ul>`/`<ol>` a run of list items is wrapped in. Markers
   * and indent are the caller's to set: a list in a legal document and a list
   * in a marketing block want different ones, and neither belongs here.
   */
  listClassName?: string;
  /** Applied to each `<li>`. Defaults to `className`, like every other block. */
  listItemClassName?: string;
}

/**
 * Blocks regrouped so that consecutive list items become one list.
 *
 * Portable text is flat: a bulleted list arrives as N sibling blocks each
 * carrying `listItem`, with no container. Rendering them one by one produced
 * N separate paragraphs, which is why `listItem` was declared on the type and
 * silently ignored for as long as nothing used it.
 *
 * A run ends when the marker changes or a non-list block appears, so a bulleted
 * list followed by a numbered one becomes two lists rather than one mixed one.
 *
 * `level` is not read. Nesting would mean building a tree, and nothing in the
 * content uses a second level; a nested item would render flat rather than
 * wrongly indented.
 */
type Run =
  | { kind: 'block'; block: PortableTextBlock }
  | { kind: 'table'; table: PortableTextTable }
  | { kind: 'list'; marker: 'bullet' | 'number'; blocks: PortableTextBlock[] };

function toRuns(blocks: PortableTextContent[]): Run[] {
  const runs: Run[] = [];

  for (const block of blocks) {
    // A table is a sibling object in the array, not a block — it has no style,
    // no spans and no marker, and it also closes any open list run.
    if (block._type === 'table') {
      runs.push({ kind: 'table', table: block });
      continue;
    }

    const marker = block.listItem;

    if (!marker) {
      runs.push({ kind: 'block', block });
      continue;
    }

    const open = runs[runs.length - 1];
    if (open?.kind === 'list' && open.marker === marker) open.blocks.push(block);
    else runs.push({ kind: 'list', marker, blocks: [block] });
  }

  return runs;
}

export function PortableText({
  blocks,
  className = '',
  listClassName = '',
  listItemClassName,
}: PortableTextProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <>
      {toRuns(blocks).map((run, index) => {
        if (run.kind === 'block') {
          return <Block key={run.block._key} block={run.block} className={className} />;
        }

        if (run.kind === 'table') {
          return <Table key={run.table._key} table={run.table} />;
        }

        const List = run.marker === 'number' ? 'ol' : 'ul';
        return (
          // Index-keyed: a run has no identity of its own, and this list is
          // derived from static content that never reorders.
          <List key={`${run.marker}-${index}`} className={listClassName}>
            {run.blocks.map((block) => (
              <li key={block._key} className={listItemClassName ?? className}>
                <Children block={block} />
              </li>
            ))}
          </List>
        );
      })}
    </>
  );
}

/**
 * A table.
 *
 * Carries no classes of its own, the same way the lists above leave markers
 * and indent to the caller — a rate grid in a legal document and a table in a
 * marketing block want different rules, and the caller already has the
 * `[&_th]`/`[&_td]` selectors to set them.
 *
 * The scroll wrapper IS structural and so belongs here: a table has an
 * intrinsic minimum width, and without somewhere to overflow a narrow one
 * scrolls the whole page sideways on a phone. It is keyboard-focusable because
 * a region that scrolls must be reachable without a pointer.
 *
 * `scope` on both axes: the head row labels the columns and the first cell of
 * each body row labels the row, which is what lets a screen reader announce
 * '2 Children, Annual Term Total, $2,820' instead of a bare figure.
 */
function Table({ table }: { table: PortableTextTable }) {
  return (
    <div className="overflow-x-auto" tabIndex={0}>
      <table>
        <thead>
          <tr>
            {table.head.map((cell, index) => (
              // Index-keyed: a header cell has no identity beyond its position.
              <th key={index} scope="col">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row._key}>
              {row.cells.map((cell, index) =>
                index === 0 ? (
                  <th key={index} scope="row">
                    {cell}
                  </th>
                ) : (
                  <td key={index}>{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A block's spans. Shared by the block elements and by list items. */
function Children({ block }: { block: PortableTextBlock }) {
  return (
    <>
      {block.children.map((span) => (
        <Span key={span._key} span={span} block={block} />
      ))}
    </>
  );
}

function Block({ block, className }: { block: PortableTextBlock; className: string }) {
  const children = <Children block={block} />;

  switch (block.style) {
    case 'h2':
      return <h2 className={className}>{children}</h2>;
    case 'h3':
      return <h3 className={className}>{children}</h3>;
    case 'h4':
      return <h4 className={className}>{children}</h4>;
    case 'blockquote':
      return <blockquote className={className}>{children}</blockquote>;
    default:
      return <p className={className}>{children}</p>;
  }
}

function Span({ span, block }: { span: PortableTextSpan; block: PortableTextBlock }) {
  let content: React.ReactNode = span.text;

  if (span.marks.includes('strong')) content = <strong>{content}</strong>;
  if (span.marks.includes('em')) content = <em>{content}</em>;
  if (span.marks.includes('underline')) content = <u>{content}</u>;

  // Remaining marks are _keys pointing into markDefs — currently only links.
  const linkDef = block.markDefs.find((def) => span.marks.includes(def._key));
  if (!linkDef) return <>{content}</>;

  // Opens the signup dialog, the same as every mailing-list button on the
  // site, so a link in prose and a CTA behave identically. NewsletterTrigger
  // renders an anchor to the footer's form, which is the no-JavaScript path.
  if (linkDef.kind === 'newsletter') {
    return <NewsletterTrigger>{content}</NewsletterTrigger>;
  }

  if (linkDef.kind === 'internal') {
    return <NextLink href={linkDef.href}>{content}</NextLink>;
  }

  return (
    <a
      href={linkDef.href}
      {...(linkDef.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {content}
    </a>
  );
}
