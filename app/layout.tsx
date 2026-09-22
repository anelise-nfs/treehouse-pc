import type { Metadata } from 'next';
import { Betania_Patmos, Libre_Baskerville, Quicksand } from 'next/font/google';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteShell } from '@/components/SiteShell';
import { getHeaderLogoSizes, getSiteSettings } from '@/lib/content';
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

const sans = Quicksand({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-quicksand',
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: {
      default: settings.siteName,
      template: `%s — ${settings.siteName}`,
    },
    description: settings.defaultSeo?.description,
    // Pre-launch. Flip this in content, not here.
    robots: settings.defaultSeo?.noIndex ? { index: false, follow: false } : undefined,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, logoSizes] = await Promise.all([getSiteSettings(), getHeaderLogoSizes()]);

  return (
    <html lang="en" className={`${script.variable} ${serif.variable} ${sans.variable}`}>
      <body>
        {/* The header overlays the hero, so keyboard users need a way past it. */}
        <a href="#main" className="sr-only focus:not-sr-only">
          Skip to content
        </a>
        <SiteShell
          siteName={settings.siteName}
          logo={settings.logo}
          navLinks={settings.primaryNav}
          logoSizes={logoSizes}
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
      </body>
    </html>
  );
}
