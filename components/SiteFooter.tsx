import NextLink from 'next/link';
import type { Link, Location, SanityImage, SocialLink } from '@/types/content';

/**
 * `tel:` needs the bare E.164 number; the display string keeps its punctuation.
 * Derived rather than stored twice so the two cannot disagree.
 */
function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return `tel:+${digits.length === 10 ? `1${digits}` : digits}`;
}

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
const LINK = 'inline-flex min-h-6 items-center leading-6 text-white no-underline';

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

  return (
    <footer className="bg-pine text-white">
      <div className="container-page py-[var(--spacing-block)] md:pb-[var(--spacing-block)] md:pt-[var(--spacing-section)]">
        <div className="grid gap-[var(--spacing-gutter)] md:gap-[var(--spacing-block)] md:grid-cols-2 lg:grid-cols-3">
          <div>
            {logoWhite ? (
              <img
                src={logoWhite.url}
                alt={logoWhite.alt}
                width={logoWhite.width}
                height={logoWhite.height}
                className="w-52"
              />
            ) : (
              <p className="font-sans text-[length:var(--text-h3)] font-bold">{siteName}</p>
            )}

            {tagline ? (
              <p className="mt-2 font-serif text-[length:var(--text-ui)] leading-[1.4]">
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
          </div>

          {footerNav && footerNav.length > 0 ? (
            <nav aria-label="Footer">
              <h2 className="font-script text-[length:var(--text-script-badge)] leading-[var(--leading-heading)]">
                explore
              </h2>
              <ul className="mt-3 flex flex-col">
                {footerNav.map((item) => (
                  <li key={`${item.label}-${item.href}`}>
                    <FooterLink link={item} />
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          <div>
            <h2 className="font-script text-[length:var(--text-script-badge)] leading-[var(--leading-heading)]">
              say hello
            </h2>

            <ul className="mt-3 flex flex-col">
              {location?.email ? (
                <li>
                  <a href={`mailto:${location.email}`} className={LINK}>
                    {location.email}
                  </a>
                </li>
              ) : null}
              {location?.phone ? (
                <li>
                  <a href={telHref(location.phone)} className={LINK}>
                    {location.phone}
                  </a>
                </li>
              ) : null}
            </ul>

            {hours && hours.length > 0 ? (
              <div className="mt-2 font-sans text-[length:var(--text-caption)] leading-[1.45]">
                {hours.map((entry) => (
                  <p key={entry._key}>
                    {entry.days}
                    <span className="block">{entry.hours}</span>
                  </p>
                ))}
              </div>
            ) : null}

            {location?.email ? (
              <p className="mt-[var(--spacing-gutter)] font-sans text-[length:var(--text-caption)] leading-[1.45]">
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
          </div>

          {socialLinks && socialLinks.length > 0 ? (
            <div>
              <h2 className="font-script text-[length:var(--text-script-badge)] leading-[var(--leading-heading)]">
                follow along
              </h2>
              <ul className="mt-[var(--spacing-gutter)] flex flex-col">
                {socialLinks.map((social) => (
                  <li key={social._key}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={LINK}
                    >
                      {social.label ?? social.platform}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="mt-[var(--spacing-gutter)] flex flex-wrap items-center justify-between gap-x-[var(--spacing-gutter)] border-t border-white/25 pt-2 font-sans text-[length:var(--text-caption)]">
          <p>
            © {year} {siteName} Park City
          </p>

          {legalNav && legalNav.length > 0 ? (
            <ul className="flex flex-wrap gap-[var(--spacing-block)]">
              {legalNav.map((item) => (
                <li key={`${item.label}-${item.href}`}>
                  <FooterLink link={item} />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
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
