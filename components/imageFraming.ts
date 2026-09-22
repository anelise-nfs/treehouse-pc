import type { SanityImage } from '@/types/content';

/**
 * Framing for an image cropped to a fixed-ratio container, from the authored
 * hotspot. The container's ratio and the source's rarely match, so something is
 * cut; the hotspot decides what survives. Absent one, center.
 *
 * Shared by every block that crops to a ratio, so the rule stays one rule.
 */
export function objectPosition(image: SanityImage): string | undefined {
  if (!image.hotspot) return undefined;
  return `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`;
}
