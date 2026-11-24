import type { SiteSettings } from '@/types/content';
import { parkCity } from './location';

export const siteSettings: SiteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  siteName: 'Treehouse',
  // PLACEHOLDER: footer strapline, not from the brand guide.
  tagline: "Park City's indoor play cafe",
  // v2 artwork from the client, trimmed of the transparent padding the supplied
  // file carried (4.7% each side, 14.2% top and bottom) so the image box is the
  // wordmark itself — the header aligns the trigger to this edge. Its colours
  // are deeper than the SVG it replaces, which read as washed out.
  logo: {
    url: '/images/logo_treehouse_v2.png',
    alt: 'Treehouse',
    width: 2176,
    height: 430,
  },
  logoWhite: {
    url: '/images/logo_treehouse_white.svg',
    alt: 'Treehouse',
    width: 332,
    height: 65,
  },
  // The homepage hamburger panel. Contact joins it because the page is real
  // and the homepage is otherwise a dead end to it — the top bar that carries
  // it elsewhere does not render here.
  primaryNav: [
    { label: 'Home', kind: 'internal', href: '/' },
    { label: 'Early Bird', kind: 'internal', href: '/early-bird' },
    { label: 'FAQ', kind: 'internal', href: '/faq' },
    { label: 'In the News', kind: 'internal', href: '/press' },
    // Contact stays last, where a nav conventionally puts it. The footer lists
    // these in a different order because it is a directory grouped by kind,
    // not a path through the site.
    { label: 'Contact', kind: 'internal', href: '/contact' },
  ],
  /**
   * The sub-page top bar. Only pages that exist go in it: a nav link to a page
   * that is not built is worse than no link at all.
   *
   * Visit, Memberships, Parties and Cafe belong here as they are built. Until
   * then they stay in the footer, pointed at the matching homepage section —
   * the footer is a directory and may point anywhere, while this bar is
   * navigation and should not.
   */
  topNav: [
    { page: '', label: 'Home' },
    // Early Bird is the main sub-page at launch and the one thing the bar most
    // needs to point at. It retires when the founding-membership sale closes,
    // and retiring it is deleting this line.
    { page: 'early-bird', label: 'Early Bird' },
    // Labels are set rather than inherited: /faq's own title is 'good
    // questions', which is right on the page and useless in a nav bar.
    { page: 'faq', label: 'FAQ' },
    { page: 'press', label: 'In the News' },
    { page: 'contact', label: 'Contact' },
  ],
  /**
   * The footer's single row of links. Parties is a Phase 2 page that does not
   * exist yet and points at the matching homepage section until it does;
   * path-qualified rather than a bare fragment so it also works from
   * /early-bird, where a '#parties' alone would do nothing. Repoint it at a
   * real route when that page is built.
   *
   * Visit, Memberships and Cafe were here too and are held back for now. The
   * homepage sections they pointed at are all still there.
   *
   * legalNav is separate and renders in the bar under the divider, not in
   * this row — see SiteFooter.
   */
  footerNav: [
    { label: 'Home', kind: 'internal', href: '/' },
    { label: 'Early Bird', kind: 'internal', href: '/early-bird' },
    // A plain navigation link, not a checkout trigger: the footer takes you to
    // the page, and the button on the page opens the store. A purchase overlay
    // launched from the footer of a privacy policy is not what anyone clicking
    // a footer expects.
    { label: 'Gift Cards', kind: 'internal', href: '/gift-cards' },
    { label: 'Contact', kind: 'internal', href: '/contact' },
    { label: 'Parties', kind: 'internal', href: '/#parties' },
    { label: 'FAQ', kind: 'internal', href: '/faq' },
    // EDITORIAL GROUP. Kept last and together, after the pages about visiting
    // and buying, because these two are about reading. 'Blog' belongs directly
    // beneath this line when the Phase 2 blog ships — its `post` type is
    // already defined in types/content.ts. Adding it is one entry here and a
    // route; nothing about this row has to be restructured to take it, which
    // is why the group exists now with one member in it.
    { label: 'In the News', kind: 'internal', href: '/press' },
  ],
  legalNav: [
    { label: 'Privacy', kind: 'internal', href: '/privacy' },
    { label: 'Terms', kind: 'internal', href: '/terms' },
  ],
  /**
   * Instagram is live. Facebook is a placeholder: an entry with no `url`
   * renders as the glyph alone rather than as a link to nowhere. Paste the url
   * in when the client confirms it and it becomes a link — no other change.
   *
   * X was here too and has been removed. The glyph is still in SocialIcon if
   * it is ever wanted back; this list is the only thing that decides what
   * shows.
   */
  socialLinks: [
    {
      _key: 'instagram',
      platform: 'instagram',
      url: 'https://www.instagram.com/treehouse.parkcity',
    },
    // Staged, not rendered. No url means the footer skips it entirely, so the
    // entry can sit here until the account exists and go live the moment
    // someone pastes the address — no code change, here or anywhere.
    { _key: 'facebook', platform: 'facebook' },
  ],
  defaultSeo: {
    description:
      "A playground for the kids. A cafe for you. Park City's one and only premium indoor play space for ages 0–12.",
    // LAUNCHED. This was `noIndex: true` while the site was pre-launch;
    // clearing it is what opened the site to crawlers. Setting it back to true
    // takes the whole site out of the index in one line, and a single page can
    // still override it either way with its own `seo.noIndex`.
    //
    // The environment gate is separate and still applies: lib/site.ts keeps
    // every preview and every laptop noindex regardless of what is set here.
  },
  location: parkCity,
};
