import type { BandColor, PageHeaderBlock, PageHeaderHeight } from '@/types/content';
import { DecorationLayer } from '@/components/doodles/DecorationLayer';
import { SeamDefs } from './SeamDefs';

const BAND_BG: Record<BandColor, string> = {
  pine: 'bg-pine',
  mint: 'bg-mint',
  tangerine: 'bg-tangerine',
  flamingo: 'bg-flamingo',
  seafoam: 'bg-seafoam',
  sunshine: 'bg-sunshine',
  lime: 'bg-lime',
  tomato: 'bg-tomato',
  sky: 'bg-sky',
  ocean: 'bg-ocean',
};

/**
 * Total height of the opener, and the stacked photograph's share of it.
 *
 * Both are well under the hero's 100dvh: a sub-page is somewhere you arrive on
 * your way to the content, so the opener announces the page and gets out of the
 * way. `small` is the default; `medium` exists for a page whose photograph is
 * the point.
 *
 * The desktop values are min-heights — the text column sets the real height if
 * a long title wraps past them — while the stacked ones are fixed, because
 * there the photograph is a band above the title rather than a column beside it.
 */
const HEIGHTS: Record<PageHeaderHeight, { section: string; media: string }> = {
  small: {
    section: 'lg:min-h-[clamp(19rem,42vh,27rem)]',
    media: 'h-[30vh] min-h-[11rem] max-h-[20rem]',
  },
  medium: {
    section: 'lg:min-h-[clamp(23rem,54vh,34rem)]',
    media: 'h-[38vh] min-h-[14rem] max-h-[25rem]',
  },
};

/**
 * Sub-page opener: the page's h1 on linen beside a photograph, split by the
 * same S-curve the homepage hero uses.
 *
 * Deliberately still. The hero's scroll choreography belongs to the homepage,
 * where it is the first thing a visitor meets; repeating it on every sub-page
 * would make the chrome the subject. Nothing here animates, including the slow
 * drift the hero's photograph carries.
 *
 * Nothing overlays the photograph either. The title sits on linen as ink, and
 * the site header on these pages is the solid cream bar above this block in
 * normal flow rather than a transparent one over the picture — so no text and
 * no wordmark ever lands on an image whose brightness varies per pixel. That is
 * what makes this safe when the photography becomes author-selectable in Phase
 * 2: no crop can introduce a contrast failure.
 *
 * The photograph is decorative — the title carries the meaning — so it takes
 * empty alt and is hidden from assistive tech.
 */
export function PageHeader({
  title,
  image,
  height,
  bandColor = 'mint',
  decorations,
  anchorId,
}: PageHeaderBlock) {
  const size = HEIGHTS[height];

  /* Favour the top of the image. These renders are darkest at the ceiling, and
     a short crop taken from the vertical centre lands on the busiest band of
     the photo. An authored hotspot wins. */
  const objectPosition = image.hotspot
    ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`
    : '50% 15%';

  return (
    // clip-path rather than overflow-hidden: the sides and top still clip, so
    // nothing here can widen the document or ride up into the nav bar, but the
    // bottom is left open for a `bleed` decoration to hang past the block's
    // foot. overflow-hidden cannot express one axis — it sliced the bleeding
    // marks off at the seam. Same device as the homepage band below the hero.
    <section
      id={anchorId}
      className="relative isolate bg-surface [clip-path:inset(0_0_-100vh_0)]"
    >
      <SeamDefs />

      {/* No top padding to clear the header, unlike the hero: the top bar on
          these pages is in normal flow, so this block already starts beneath
          it. The two columns stack below lg and split above it. */}
      <div className={`relative flex flex-col lg:block ${size.section}`}>
        {/* MEDIA */}
        <div
          className={`relative w-full shrink-0 ${size.media} lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:max-h-none lg:min-h-0 lg:w-[60%] xl:w-[62%]`}
        >
          {/* A second copy of the shape, offset behind the photo, so the seam
              reads as a brand-coloured edge rather than a cut. Same device and
              same offsets as the hero's. */}
          <div
            aria-hidden="true"
            className={`hero-seam pointer-events-none absolute inset-0 translate-y-2 lg:-translate-x-3 lg:translate-y-0 ${BAND_BG[bandColor]}`}
          />

          <div className="hero-seam absolute inset-0">
            <img
              src={image.url}
              alt=""
              aria-hidden="true"
              style={{ objectPosition }}
              className="size-full object-cover"
            />
          </div>
        </div>

        {/* TITLE — indented past the gutter once the columns split, so the h1
            sits a little inside the wordmark above it rather than flush under
            it. Flush looked under-set against the wider photograph; the inset
            gives the title its own margin and reads as deliberate.

            The indent is desktop-only. Stacked, the title is right-aligned
            against the gutter and there is nothing to its left to inset from.

            Right-aligned while stacked and left-aligned once the columns
            split, matching the hero. */}
        <div
          className={`relative flex flex-1 flex-col justify-center px-[var(--spacing-gutter)] pb-[var(--spacing-block)] pt-[var(--spacing-block)] text-right lg:w-[40%] lg:py-[var(--spacing-section)] lg:pl-[calc(var(--spacing-gutter)+2rem)] lg:text-left xl:w-[38%] ${size.section}`}
        >
          {/* Pine on linen is 6.42:1 — AA at any size, with room to spare.
              The hero sets its h1 in mint, which is 3.01:1 and passes only
              because that text can never render below 24px. This one has no
              such floor to lean on: it is set at --text-display, which is the
              page's h1 and the one piece of type most likely to be scaled by a
              reader. Mint here would be a real failure, not a tight pass. */}
          {/* Inside the title column, not the section: the slots are corners of
              whatever box the layer sits in, and on the section a top-right
              mark would land in the middle of the photograph. Scoped here they
              are corners of the linen, which is the only part of this block
              with margin to decorate.

              Desktop-only and static, both deliberate. While the columns are
              stacked the copy spans the full width and is right-aligned, so
              the corners are on top of the title rather than beside it; and
              this block animates nothing, so marks settling into place would
              be the only movement on it.

              relative z-10 on the h1 keeps the title above the layer whatever
              an author picks — the layer is z-0 and these never overlap at the
              sizes below, but a larger doodle should pass behind the text
              rather than through it. */}
          <DecorationLayer decorations={decorations} bounds="header" from="lg" enter={false} />

          <h1 className="relative z-10 font-sans text-[length:var(--text-display)] font-bold leading-[var(--leading-display)] text-pine">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}
