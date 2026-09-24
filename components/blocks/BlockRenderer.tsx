import type { Block } from '@/types/content';
import { DropInSection } from './DropInSection';
import { FeatureGrid } from './FeatureGrid';
import { Hero } from './Hero';
import { HoursAddress } from './HoursAddress';
import { ImageTextSplit } from './ImageTextSplit';
import { MembershipSection } from './MembershipSection';
import { LocationMap } from './LocationMap';
import { PageHeader } from './PageHeader';
import { PartyPackages } from './PartyPackages';
import { PhotoGallery } from './PhotoGallery';
import { RichText } from './RichText';
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
      return <RichText {...block} />;
    case 'imageTextSplit':
      return <ImageTextSplit {...block} />;
    case 'photoGallery':
      return <PhotoGallery {...block} />;
    case 'featureGrid':
      return <FeatureGrid {...block} />;
    case 'dropInSection':
      return <DropInSection {...block} />;
    case 'membershipSection':
      return <MembershipSection {...block} />;
    case 'partyPackages':
      return <PartyPackages {...block} />;
    case 'locationBlock':
      return <LocationMap {...block} />;
    case 'hoursAddress':
      return <HoursAddress {...block} />;
    case 'faqAccordion':
      return null;
    // Parked for Phase 2 (Memberships, Parties): kept deliberately, not dead code.
    case 'ctaBanner':
      return null;
    case 'bookingEmbed':
      return null;
    default: {
      // If this line errors, a block type was added to the union without a case.
      const unhandled: never = block;
      void unhandled;
      return null;
    }
  }
}
