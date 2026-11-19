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
  return `${percent(image.hotspot.x)} ${percent(image.hotspot.y)}`;
}

/**
 * A fraction as a percentage, rounded to two decimals.
 *
 * Rounded because the bare multiplication emits what binary floating point
 * actually holds: 0.58 * 100 is 57.99999999999999, which is correct to the
 * pixel and reads as a bug in the markup. Two decimals is finer than any
 * display can place a crop.
 */
function percent(fraction: number): string {
  return `${Number((fraction * 100).toFixed(2))}%`;
}
