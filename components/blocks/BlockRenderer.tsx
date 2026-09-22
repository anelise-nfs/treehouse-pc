import type { Block } from '@/types/content';
import { DropInSection } from './DropInSection';
import { Hero } from './Hero';
import { ImageTextSplit } from './ImageTextSplit';
import { MembershipSection } from './MembershipSection';
import { PageHeader } from './PageHeader';
import { SectionBand } from './SectionBand';

/**
 * Maps content blocks to components.
 *
 * Every case returns null for now — the block components are not built yet.
 * The `default` branch assigns the narrowed block to `never`, so adding a member
 * to the `Block` union without adding a case here is a compile error rather than
 * a section that silently fails to render.
 */
export function BlockRenderer({ blocks }: BlockRendererProps) {
  return (
    <>
      {blocks.map((block) => (
        <BlockSwitch key={block._key} block={block} />
      ))}
    </>
  );
}

export interface BlockRendererProps {
  blocks: Block[];
}

function BlockSwitch({ block }: { block: Block }) {
  switch (block._type) {
    case 'hero':
      return <Hero {...block} />;
    case 'pageHeader':
      return <PageHeader {...block} />;
    case 'sectionBand':
      return <SectionBand {...block} />;
    case 'richText':
      return null;
    case 'imageTextSplit':
      return <ImageTextSplit {...block} />;
    case 'photoGallery':
      return null;
    case 'featureGrid':
      return null;
    case 'pricingTable':
      return null;
    case 'dropInSection':
      return <DropInSection {...block} />;
    case 'membershipSection':
      return <MembershipSection {...block} />;
    case 'partyPackages':
      return null;
    case 'perksList':
      return null;
    case 'locationBlock':
      return null;
    case 'faqAccordion':
      return null;
    case 'ctaBanner':
      return null;
    case 'bookingEmbed':
      return null;
    case 'divider':
      return null;
    default: {
      // If this line errors, a block type was added to the union without a case.
      const unhandled: never = block;
      void unhandled;
      return null;
    }
  }
}
