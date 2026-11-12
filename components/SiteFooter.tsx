import NextLink from 'next/link';
import type { Link, Location, SanityImage, SocialLink } from '@/types/content';
import { NewsletterSignup } from '@/components/NewsletterSignup';

/**
 * Shared row styling for the footer's dense link lists.
 *
 * 24px rows: WCAG 2.2's 2.5.8 Target Size (Minimum) at AA. The 44px used for
 * primary controls is 2.5.5 at AAA, plus platform guidance — not an AA floor.
 * Each row is its own target at full label width, so it satisfies the criterion
 * outright rather than relying on the spacing exception. This is the minimum:
 * anything tighter drops below AA.
 *
 * leading-6 matches the min-height. Without it the inherited body leading (1.65)
 * sets the line box taller than the target and the rows come out at 28px.
 */
/**
 * overflow-wrap:anywhere, not break-word: only `anywhere` reduces an element's
 * min-content width. The email is a single unbreakable token, and under WCAG
 * 1.4.12's letter-spacing it measured 329px against a 288px column — grid items
 * are min-width:auto, so the column could not shrink and the page scrolled
 * sideways at 320px. min-w-0 lets the item shrink to match.
 */
/**
 * The underline is always present and merely transparent, rather than being
 * switched on at hover.
 *
 * `text-decoration-line` cannot be transitioned — it snaps — so toggling
 * `underline` gave a hard on/off. `text-decoration-color` can be, so the rule
 * is painted from the start and only its colour animates, which is what makes
 * it arrive rather than appear. It also means the line occupies its space at
 * all times and nothing shifts on hover.
 *
 * underline-offset-4 keeps the rule clear of the descenders in 'Early Bird'
 * and 'Privacy'; at the default offset it ran through them.
 *
 * prefers-reduced-motion is handled globally in globals.css, which collapses
 * the duration rather than removing the cue.
 */
const LINK =
  'inline-flex min-h-6 min-w-0 items-center text-[length:var(--text-ui)] leading-6 ' +
  'text-white [overflow-wrap:anywhere] ' +
  'underline decoration-transparent decoration-1 underline-offset-4 ' +
  'transition-[text-decoration-color] duration-200 ease-out ' +
  'hover:decoration-white focus-visible:decoration-white';

/** One type size for all three column headings. */
const COLUMN_HEADING =
  'font-script text-[length:var(--text-script-footer)] leading-[var(--leading-heading)]';

/**
 * The address with a break opportunity after the @.
 *
 * An email is one unbreakable token, and in a narrow column the `anywhere`
 * rule on LINK — which is there to stop the page scrolling sideways at 320px —
 * breaks it mid-word: "holler@treehousepa / rkcity.com". A `<wbr>` gives the
 * browser a sensible place to break first, so it splits at the @ and only
 * falls back to breaking mid-word if even that does not fit.
 */
function EmailText({ address }: { address: string }) {
  const at = address.indexOf('@');
  if (at === -1) return <>{address}</>;

  return (
    <>
      {address.slice(0, at + 1)}
      <wbr />
      {address.slice(at + 1)}
    </>
  );
}

export interface SiteFooterProps {
  siteName: string;
  logoWhite?: SanityImage;
  tagline?: string;
  /** Resolved from SiteSettings by the layout; the component stays props-only. */
  location?: Location;
  footerNav?: Link[];
  legalNav?: Link[];
  socialLinks?: SocialLink[];
}

/**
 * Site chrome, not a content block. It lives in the root layout so it renders
 * on every route and cannot be deleted from a page's block array.
 *
 * White on pine is 6.66:1 — the one brand color that takes white text (see
 * ARCHITECTURE.md → Color rule). Nothing here needs a contrast deferral.
 */
export function SiteFooter({
  siteName,
  logoWhite,
  tagline,
  location,
  footerNav,
  legalNav,
  socialLinks,
}: SiteFooterProps) {
  // Render-time on a static build, which is correct: the year is baked when
  // the site is built and a rebuild ships the new one.
  const year = new Date().getFullYear();
  const address = location?.address;
  const hours = location?.hours;

  /* One visual row, two content lists. They stay separate in SiteSettings
     because they are different things — a directory of pages and the legal
     boilerplate — and Phase 2 will edit them separately. Joining them here is
     a presentation decision, and reversing it does not touch content. */
  const rowLinks = [...(footerNav ?? []), ...(legalNav ?? [])];

  return (
    <footer className="bg-pine text-white">
      {/* The bottom padding is the space under the copyright line, and is set
          to match the space above it rather than to the block token the top of
          the footer uses. */}
      <div className="container-page py-[var(--spacing-block)] pb-[calc(var(--spacing-block)*0.7)] md:pt-[var(--spacing-section)]">
        {/* Two columns, each doing one job. Left: who and where, and every way
            of reaching a person. Right: the directory along the top, and the
            one thing here that asks something of the reader beneath it.

            The two columns stretch to the same height, so the right one can
            pin the link row to the top — level with the top of the wordmark —
            and the signup to the bottom, level with the last line of the left
            column. Aligning only the tops left the signup floating in the
            middle of the row with dead space beneath it. */}
        <div className="flex flex-col gap-[calc(var(--spacing-block)*1.5)] text-center lg:flex-row lg:justify-between lg:gap-[var(--spacing-section)] lg:text-left">
          <div>
            {logoWhite ? (
              <img
                src={logoWhite.url}
                alt={logoWhite.alt}
                width={logoWhite.width}
                height={logoWhite.height}
                className="mx-auto w-44 lg:mx-0"
              />
            ) : (
              <p className="font-sans text-[length:var(--text-h3)] font-bold">{siteName}</p>
            )}

            {tagline ? (
              <p className="mt-2 font-serif text-[length:var(--text-caption)] leading-[1.45]">
                {tagline}
              </p>
            ) : null}

            {address ? (
              <p className="mt-2 font-sans text-[length:var(--text-caption)] leading-[1.45]">
                {address.street}
                <span className="block">
                  {address.city}, {address.region} {address.postalCode}
                </span>
              </p>
            ) : null}

            {/* Gutter rather than block: the address above and this heading
                are both part of the same left-hand column, so the step between
                them is a gap inside one group rather than the gap between two.
                It also sets the footer's height — the signup opposite is
                pinned to the bottom of this column. */}
            <h2 className={`${COLUMN_HEADING} mt-[calc(var(--spacing-block)*1.5)] lg:mt-[var(--spacing-gutter)]`}>
              say hello
            </h2>

            {/* Email only. No phone number is published at launch, by the
                client's explicit direction — the renderer is gone rather than
                the value blanked, so a number appearing in the content cannot
                put one back on the page by accident. */}
            {location?.email ? (
              <p className="mt-1">
                <a href={`mailto:${location.email}`} className={LINK}>
                  <EmailText address={location.email} />
                </a>
              </p>
            ) : null}

            {hours && hours.length > 0 ? (
              <div className="mt-1 font-sans text-[length:var(--text-caption)] leading-[1.45]">
                {hours.map((entry) => (
                  <p key={entry._key}>
                    {entry.days} · {entry.hours}
                  </p>
                ))}
              </div>
            ) : null}

            {location?.email ? (
              <p className="mt-2 font-sans text-[length:var(--text-caption)] leading-[1.45]">
                Interested in partnering or franchising?{' '}
                <a
                  href={`mailto:${location.email}?subject=${encodeURIComponent(
                    'Partnership or franchise inquiry',
                  )}`}
                  className="text-white underline"
                >
                  Get in touch
                </a>
              </p>
            ) : null}

            {socialLinks && socialLinks.length > 0 ? (
              <ul className="mt-[var(--spacing-gutter)] flex flex-wrap justify-center gap-x-[var(--spacing-gutter)] lg:justify-start">
                {socialLinks.map((social) => (
                  <li key={social._key}>
                    <a href={social.url} target="_blank" rel="noopener noreferrer" className={LINK}>
                      {social.label ?? social.platform}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* RIGHT — the directory as one horizontal run with no heading above
              it. No heading because a row of links across the top of a footer
              reads as navigation without being labelled, and the word was
              taking a line to say so.

              It wraps rather than scrolls, so the four homepage anchors
              becoming real pages costs a second row at narrow widths and
              nothing at all at wide ones. */}
          {/* flex at every width, not just lg, because the two children swap
              order between them: stacked, the signup comes first and the link
              list last, which puts the directory immediately above the
              copyright where a reader expects it. `order` needs a flex parent
              to do anything, and the spacing is a gap rather than margins on
              the children so it survives the swap. */}
          <div className="flex flex-col items-center gap-[calc(var(--spacing-block)*1.5)] lg:items-end lg:justify-between lg:gap-[var(--spacing-block)]">
            {rowLinks.length > 0 ? (
              <nav aria-label="Footer" className="order-2 lg:order-1">
                {/* Two columns on a phone, a single row from md. As one
                    wrapped row the seven labels broke into ragged lines of
                    three and four; as one column they ran 760px tall. Two
                    even columns sized to their content (w-max) and centred
                    (mx-auto) are four tidy rows.

                    The labels stay left-aligned to each other inside that
                    centred block — centring each one individually would give
                    four rows of two ragged, unrelated words. Right-aligned
                    only at lg, where the list finally has a column of its
                    own. */}
                <ul className="mx-auto grid w-max grid-cols-2 gap-x-[var(--spacing-block)] text-left md:flex md:w-auto md:flex-wrap md:gap-x-[var(--spacing-block)] lg:justify-end">
                  {rowLinks.map((item) => (
                    <li key={`${item.label}-${item.href}`}>
                      <FooterLink link={item} />
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}

            {/* Capped twice, for two different reasons. On a phone, 20rem
                keeps real margin either side so the field and its button stop
                reading as a full-width slab — and it is exactly the width the
                field's own container query needs to keep them side by side, so
                they stay on one line rather than stacking into something
                taller. From lg it is capped again so they do not stretch to
                the width of the link row above them, and pushed to the right
                edge, which it shares with that row; justify-between on the
                column drops it to the foot of the footer, so its last line
                sits on the same baseline as the left column's. The copy stays
                left-aligned: a right-aligned ragged-left paragraph is harder to
                read, and the block's own left edge lines up its heading, blurb
                and field. */}
            <NewsletterSignup
              tone="dark"
              compact
              className="order-1 w-full max-w-[20rem] text-center lg:order-2 lg:max-w-none lg:w-[22rem] lg:text-left"
            />
          </div>
        </div>

        {/* Just the line. Privacy and Terms moved up into the link row, which
            left this bar holding one item against an empty right half. */}
        <p className="mt-[var(--spacing-block)] border-t border-white/25 pt-[calc(var(--spacing-block)*0.7)] text-center font-sans text-[length:var(--text-caption)]">
          © {year} {siteName} Park City
        </p>
      </div>
    </footer>
  );
}

/** Internal links route through next/link; '#' stubs and externals do not. */
function FooterLink({ link }: { link: Link }) {
  if (link.kind === 'internal') {
    return (
      <NextLink href={link.href} className={LINK}>
        {link.label}
      </NextLink>
    );
  }

  return (
    <a
      href={link.href}
      className={LINK}
      {...(link.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {link.label}
    </a>
  );
}
