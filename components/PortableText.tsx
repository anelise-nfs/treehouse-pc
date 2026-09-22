import NextLink from 'next/link';
import type { PortableTextBlock, PortableTextSpan } from '@/types/content';

/**
 * Minimal portable text renderer, hand-written rather than pulled from a
 * package — see ARCHITECTURE.md → Dependency discipline. It covers what the
 * content types allow and nothing more.
 *
 * Renders nothing at all for an empty array, so a block with no body does not
 * leave an empty element behind.
 */
export interface PortableTextProps {
  blocks?: PortableTextBlock[];
  className?: string;
}

export function PortableText({ blocks, className = '' }: PortableTextProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block) => (
        <Block key={block._key} block={block} className={className} />
      ))}
    </>
  );
}

function Block({ block, className }: { block: PortableTextBlock; className: string }) {
  const children = block.children.map((span) => (
    <Span key={span._key} span={span} block={block} />
  ));

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
