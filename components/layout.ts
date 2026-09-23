/**
 * Horizontal inset for a section's content, sitting further in than the page
 * gutter the rest of the site uses, per the client's design.
 *
 * Shared so that a section's title bar and the content beneath it land on the
 * same edges, and so sections using it stay aligned with each other.
 */
export const CONTENT_INSET = 'px-[calc(var(--spacing-gutter)*2+var(--spacing-block))]';

/**
 * The standard breakpoint for going from a stacked layout to a multi-column
 * one: `md` (768px). Content grids across the site use it so that a page does
 * not reflow in several places at several widths as it narrows.
 *
 * Two deliberate exceptions:
 *   - The drop-in badges switch shape (card -> circle) at `sm`, which
 *     ARCHITECTURE.md -> Mobile specifies. Their column count is not a
 *     breakpoint at all; it fits itself, because the script face has a 28px
 *     floor and a circle narrower than ~13rem clips its own label.
 *   - The footer takes a third column at `lg`, where its longest line (the
 *     email address) stops wrapping.
 */
export const COLUMNS_FROM = 'md';
