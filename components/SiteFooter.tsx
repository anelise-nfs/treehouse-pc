import NextLink from 'next/link';
import type { Link, Location, SanityImage, SocialLink } from '@/types/content';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { SocialIcon } from '@/components/SocialIcon';

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

/**
 * The legal pair under the divider.
 *
 * Caption-sized to match the copyright beside it, and underlined at rest
 * rather than on hover like LINK above: this is the one place in the footer
 * where the surrounding text is not links, so nothing else marks these as
 * clickable. The hover only deepens the underline it already has.
 *
 * min-h-6 keeps the 24px target ARCHITECTURE.md allows for dense secondary
 * navigation — the text itself is 13px, which is under it.
 */
const LEGAL_LINK =
  'inline-flex min-h-6 items-center text-[length:var(--text-caption)] leading-6 ' +
  'text-white underline decoration-white/70 decoration-1 underline-offset-4 ' +
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

/** Accessible names, since a glyph has no text of its own. */
const PLATFORM_NAMES: Record<SocialLink['platform'], string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  x: 'X',
  tiktok: 'TikTok',
  youtube: 'YouTube',
};

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

  /* The directory only. legalNav used to be appended here and now renders in
     the bar under the divider — boilerplate nobody is looking for should not
     sit at the same weight as the pages people are. The two lists were always
     separate in SiteSettings, so moving one was a presentation change and
     touched no content. */
  const rowLinks = footerNav ?? [];

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

            {/* One line, comma after the street. It was two lines on the
                assumption the column was narrow; it is not, at any width the
                footer renders — the full string is about 245px against a 358px
                column on the narrowest phone. Folding it back saves a line of
                the column height the signup opposite is pinned to. */}
            {address ? (
              <p className="mt-2 font-sans text-[length:var(--text-caption)] leading-[1.45]">
                {address.street}, {address.city}, {address.region} {address.postalCode}
              </p>
            ) : null}

            {/* The address above and this heading are both part of the same
                left-hand column, so the step between them is a gap inside one
                group rather than the gap between two. It also sets the
                footer's height — the signup opposite is pinned to the bottom
                of this column, so every rem taken out here pulls that block up
                with it.

                Both steps came down: the stacked gap from block*1.5 to block,
                and the desktop one from a full gutter to three quarters. The
                column was reading as three separated blocks rather than one
                run of contact details. */}
            <h2 className={`${COLUMN_HEADING} mt-[var(--spacing-block)] lg:mt-[calc(var(--spacing-gutter)*0.75)]`}>
              say hello
            </h2>

            {/* Email only. No phone number is published at launch, by the
                client's explicit direction — the renderer is gone rather than
                the value blanked, so a number appearing in the content cannot
                put one back on the page by accident.

                The opening-status line that sat under this is gone the same
                way. location.hours still holds it and the homepage's
                hoursAddress block still renders it; it was dropped here
                because the footer repeats on every page and did not need to
                say it twice on the homepage. Restoring it is a renderer, not
                a content edit. */}
            {location?.email ? (
              <p className="mt-1">
                <a href={`mailto:${location.email}`} className={LINK}>
                  <EmailText address={location.email} />
                </a>
              </p>
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

            {/* One row of glyphs rather than a list of platform names: this
                sits directly under the contact details and should read as a
                row of marks, not a second set of links competing with the
                email address above it.

                44px targets around a 20px glyph. The footer's text links are
                allowed down to 24px (ARCHITECTURE.md → Accessibility
                baseline) because each is a full-width row; an icon has no
                label to widen it, so it gets the primary-control size. */}
            {socialLinks && socialLinks.length > 0 ? (
              <ul className="mt-[calc(var(--spacing-gutter)*0.75)] flex justify-center gap-1 lg:-ml-3 lg:justify-start">
                {socialLinks.map((social) => {
                  const name = social.label ?? PLATFORM_NAMES[social.platform];
                  const box =
                    'flex min-h-[var(--tap-target)] min-w-[var(--tap-target)] items-center justify-center';

                  return (
                    <li key={social._key}>
                      {social.url ? (
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={name}
                          className={`${box} text-white transition-opacity duration-200 ease-out hover:opacity-70 focus-visible:opacity-70`}
                        >
                          <SocialIcon platform={social.platform} className="size-5" />
                        </a>
                      ) : (
                        /* No url yet. A span, not an <a href="#">: a link that
                           goes nowhere is a dead end for a keyboard or screen
                           reader user, and aria-hidden keeps the placeholder
                           out of their way entirely. Visually the row still
                           reads as three. */
                        <span aria-hidden="true" className={`${box} text-white`}>
                          <SocialIcon platform={social.platform} className="size-5" />
                        </span>
                      )}
                    </li>
                  );
                })}
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

        {/* Copyright left, legal right, both under the divider.
            justify-between rather than two columns: there are exactly two
            items and they only need to reach opposite edges.

            flex-wrap with a row gap for the narrowest phones — if the two
            ever stop fitting on one line the legal pair drops below the
            copyright rather than squeezing it into a second line of its own. */}
        <div className="mt-[var(--spacing-block)] flex flex-wrap items-center justify-between gap-x-[var(--spacing-block)] gap-y-2 border-t border-white/25 pt-[calc(var(--spacing-block)*0.7)] font-sans text-[length:var(--text-caption)]">
          <p>
            © {year} {siteName} Park City
          </p>

          {legalNav && legalNav.length > 0 ? (
            <nav aria-label="Legal">
              <ul className="flex flex-wrap items-center gap-x-[var(--spacing-gutter)] gap-y-2">
                {legalNav.map((item) => (
                  <li key={`${item.label}-${item.href}`}>
                    <FooterLink link={item} className={LEGAL_LINK} />
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </div>
    </footer>
  );
}

/**
 * Internal links route through next/link; '#' stubs and externals do not.
 *
 * The treatment is a prop because the footer now has two: LINK for the
 * directory row and LEGAL_LINK for the pair under the divider.
 */
function FooterLink({ link, className = LINK }: { link: Link; className?: string }) {
  if (link.kind === 'internal') {
    return (
      <NextLink href={link.href} className={className}>
        {link.label}
      </NextLink>
    );
  }

  return (
    <a
      href={link.href}
      className={className}
      {...(link.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {link.label}
    </a>
  );
}
