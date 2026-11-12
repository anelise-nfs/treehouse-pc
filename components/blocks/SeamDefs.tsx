/**
 * The S-shaped seam between a text column and a photograph, shared by the
 * homepage hero and the sub-page header.
 *
 * Both paths use clipPathUnits="objectBoundingBox", so every coordinate is a
 * 0–1 fraction of the element and the curve stretches with it. A `clip-path:
 * path()` would have pinned the shape to pixel coordinates and needed a media
 * query per breakpoint. The trade is that the curve scales non-uniformly, which
 * is why both are drawn shallow — a steep curve visibly distorts when the box
 * changes proportion.
 *
 * Which path applies is decided in globals.css by `.hero-seam`: vertical from
 * the lg breakpoint, horizontal below it where the two halves stack.
 *
 * The ids are document-global, so two of these on one page would collide. They
 * cannot be: a page carries exactly one hero *or* one pageHeader (lib/content
 * warns if that is ever untrue), and those are the only two components that
 * render this.
 */
export function SeamDefs() {
  return (
    <svg aria-hidden="true" focusable="false" className="pointer-events-none absolute size-0">
      <defs>
        {/* Desktop: the photo's left edge. A shallow S — it bows right to only
            about 0.23 through the top third, crosses near 0.18 and sweeps left
            to 0.06 at the foot. The two arcs stay opposed so it still reads as
            an S rather than one bowed cut, but the top is deliberately close to
            straight; a deeper bow there drew the eye away from the headline.

            The last control point shares the end point's x, so the curve
            arrives travelling straight down. The homepage's band below leaves
            vertical too, and two vertical tangents meet without a kink; while
            this one was still drifting left at the foot, the join showed a
            corner even though the two edges touched at the right x. */}
        <clipPath id="hero-seam-vertical" clipPathUnits="objectBoundingBox">
          <path d="M0.22,0 C0.24,0.14 0.23,0.28 0.18,0.44 C0.13,0.60 0.06,0.78 0.06,1 L1,1 L1,0 Z" />
        </clipPath>

        {/* Stacked: the photo's bottom edge, a shallow wave so the linen below
            rises into the picture rather than meeting it on a ruled line. Kept
            low in the box — every percent of height above 1.0 that the curve
            leaves unused is empty space that reads as a gap above the
            headline, not as part of the picture. */}
        <clipPath id="hero-seam-horizontal" clipPathUnits="objectBoundingBox">
          <path d="M0,0 L1,0 L1,0.88 C0.82,0.98 0.63,0.84 0.43,0.95 C0.26,1 0.13,0.95 0,0.99 Z" />
        </clipPath>

        {/* The homepage band below the hero picks the curve up where the one
            above leaves it. Split: exits the photograph at 0.06, the same x its
            path ends on, so the two edges meet exactly.

            The first control point shares the start's x, so the curve leaves
            the join travelling straight down — the direction the hero's path
            now arrives in. Matching tangents, not just matching points, is what
            removes the corner: an earlier pair met at the right x but set off
            at different angles and read as a crease. The mismatch was worse
            than the fractions suggested, because that box is shorter than the
            hero's and the same gradient renders steeper in it.

            From there it rounds out to 0.142 over the full height. An earlier
            attempt arced to 0.19 inside the first third and looked like a
            deliberate notch rather than the tail of the hero's S.

            Unused by the sub-page header, which has no band beneath it. Both
            openers render the same four so neither has to know which of them
            the other needs. */}
        <clipPath id="hero-seam-after-vertical" clipPathUnits="objectBoundingBox">
          <path d="M0.06,0 C0.06,0.20 0.088,0.36 0.105,0.54 C0.122,0.72 0.138,0.88 0.142,1 L1,1 L1,0 Z" />
        </clipPath>

        {/* Stacked: a wave along that band's top edge, mirroring the one the
            photograph above ends on so the two nest instead of meeting flat. */}
        <clipPath id="hero-seam-after-horizontal" clipPathUnits="objectBoundingBox">
          <path d="M0,0.10 C0.18,0.01 0.37,0.15 0.57,0.06 C0.75,-0.02 0.88,0.05 1,0.02 L1,1 L0,1 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}
