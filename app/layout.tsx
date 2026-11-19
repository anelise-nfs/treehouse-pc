import type { Metadata } from 'next';
import { Betania_Patmos, Libre_Baskerville, Zen_Maru_Gothic } from 'next/font/google';
import { GoogleTagManager } from '@next/third-parties/google';
import { CookieNotice } from '@/components/CookieNotice';
import { ScrollEffects } from '@/components/ScrollEffects';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteShell } from '@/components/SiteShell';
import {
  getHeaderLogoSizes,
  getHeaderSurfaces,
  getHeaderVariants,
  getSiteSettings,
  getTopNav,
} from '@/lib/content';
import { isProduction, shareImage, siteUrl } from '@/lib/site';
import './globals.css';

/**
 * Self-hosted at build time — the files are emitted into the app bundle, so
 * production makes no request to Google and there is no third-party dependency
 * in the critical path. `display: 'swap'` renders fallback text immediately
 * rather than blocking on the font.
 *
 * Only the weights actually used are loaded. Betania Patmos ships a single
 * weight; asking for a second would fail the build rather than silently
 * synthesizing one.
 */
const script = Betania_Patmos({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-betania-patmos',
});

const serif = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-libre-baskerville',
});

/* Zen Maru Gothic is not a variable font, so each weight is a separate file and
   only the listed ones exist in the bundle. It has no 600, which is why UI text
   is `font-medium` (500) rather than `font-semibold` — 600 would resolve up to
   700 and read as bold. 500 is the closest match to the weight Quicksand's 600
   rendered at. */
const sans = Zen_Maru_Gothic({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-zen-maru-gothic',
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  /* Two independent reasons to stay out of the index, and either is enough.
     The environment one is structural — a preview deployment must never be
     indexed, whatever the content says. The content one is the pre-launch
     flag, which someone flips when the site goes live. Keeping them separate
     means flipping the content flag cannot accidentally expose a preview. */
  const noIndex = !isProduction || Boolean(settings.defaultSeo?.noIndex);

  return {
    // Resolves relative URLs in metadata — Open Graph images, canonicals —
    // against the canonical origin rather than whatever host served the page.
    metadataBase: new URL(siteUrl),
    title: {
      default: settings.siteName,
      template: `%s — ${settings.siteName}`,
    },
    description: settings.defaultSeo?.description,
    robots: noIndex ? { index: false, follow: false } : undefined,
    /* The site-wide default. Individual pages override title and description
       through pageMetadata, which repeats them inside its own openGraph —
       Next replaces the whole object rather than merging it, so a page that
       set only `title` would otherwise show this one's og:title. */
    openGraph: {
      type: 'website',
      siteName: settings.siteName,
      title: settings.siteName,
      description: settings.defaultSeo?.description,
      url: siteUrl,
      images: [shareImage],
    },
    /* summary_large_image, not summary: the card is 1.91:1 and the small
       variant would crop it to a square thumbnail, which is the shape that
       put the wordmark against the edges in the first place. */
    twitter: {
      card: 'summary_large_image',
      title: settings.siteName,
      description: settings.defaultSeo?.description,
      images: [shareImage.url],
    },
  };
}

/**
 * Whether to load Google Tag Manager, and which container.
 *
 * GA4 lives inside the GTM container and must load from there alone. Nothing
 * in this codebase may add gtag.js or <GoogleAnalytics /> alongside it — two
 * sources for the same property counts every pageview twice.
 *
 * Production only. `isProduction` is the same host-agnostic check robots.txt
 * uses to keep previews out of the index, read from lib/site so there is one
 * definition of "this is the real site": every preview branch and every laptop
 * is excluded, which keeps test traffic out of the client's reporting.
 *
 * NEXT_PUBLIC_GTM_FORCE_ENABLE is the escape hatch for GTM Preview mode, which
 * cannot otherwise reach a branch deploy or localhost. It belongs in .env.local
 * and never in Vercel.
 *
 * Unset NEXT_PUBLIC_GTM_ID simply means no GTM, not a broken build.
 */
const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
const gtmForceEnabled = process.env.NEXT_PUBLIC_GTM_FORCE_ENABLE === 'true';
const loadGtm = Boolean(gtmId) && (isProduction || gtmForceEnabled);

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, logoSizes, headerSurfaces, headerVariants, topNav] = await Promise.all([
    getSiteSettings(),
    getHeaderLogoSizes(),
    getHeaderSurfaces(),
    getHeaderVariants(),
    getTopNav(),
  ]);

  return (
    <html lang="en" className={`${script.variable} ${serif.variable} ${sans.variable}`}>
      {/* Direct child of <html> and before <body>, per @next/third-parties.
          The component injects the container script itself; there is no
          hand-written snippet to keep in step with it. */}
      {loadGtm && gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
      <body>
        <ScrollEffects />
        {/* The header overlays the hero, so keyboard users need a way past it. */}
        <a href="#main" className="sr-only focus:not-sr-only">
          Skip to content
        </a>
        <SiteShell
          siteName={settings.siteName}
          logo={settings.logo}
          navLinks={settings.primaryNav}
          logoSizes={logoSizes}
          headerSurfaces={headerSurfaces}
          headerVariants={headerVariants}
          topNav={topNav}
          logoWhite={settings.logoWhite}
        >
          {children}
          {/* Inside SiteShell, not beside it: the footer has to squeeze with the
              rest of the page when the menu panel opens. */}
          <SiteFooter
            siteName={settings.siteName}
            logoWhite={settings.logoWhite}
            tagline={settings.tagline}
            location={settings.location}
            footerNav={settings.footerNav}
            legalNav={settings.legalNav}
            socialLinks={settings.socialLinks}
          />
        </SiteShell>

        {/* Outside SiteShell, unlike the footer: this is fixed to the viewport
            and must not squeeze or slide with the page when the menu panel
            opens. */}
        <CookieNotice />
      </body>
    </html>
  );
}
