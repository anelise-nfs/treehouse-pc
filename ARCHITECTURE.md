# Treehouse Park City — Architecture

Reference for anyone working in this repo: conventions, constraints, and code decisions.

## What this is

Marketing website for Treehouse Park City, an indoor play cafe for kids ages 0–12 opening in
Park City, Utah in late 2026. Built by North Fork Solutions.

**Phase 1 (current):** static marketing site with hardcoded content, selling founding memberships,
targeting a September launch. No CMS.

**Phase 2:** Sanity CMS wired in behind the same components, plus expanded pages and additional
content types.

The most important architectural rule follows from that split.

## Prime directive: components never know where content comes from

Phase 2 must be able to swap the content source without touching components.

- Content types are defined in `/types/content.ts`. These types are the contract.
- Mock content lives in `/content/*.ts` and conforms to those types.
- **`/lib/content.ts` is the only file permitted to import from `/content/`.** It exports
  `getPage(slug)`, `getSiteSettings()`, `getPricing()`, `getPartyPackages()`, `getFaqs()`.
- Components receive props. They never import content, never read from `/content/`, never reach
  for global state.

When Sanity is added, `/lib/content.ts` is rewritten to run GROQ queries and `/content/` is deleted.
Nothing else changes. Importing content directly into a component is the one thing that makes
Phase 2 expensive, so it is worth being strict about.

The data access functions are `async` from the start so the Sanity swap doesn't change call sites.

## Stack

- Next.js (App Router), TypeScript strict mode, static generation
- Tailwind v4, with design tokens declared in CSS via `@theme` in `app/globals.css`
- Deployed to Netlify or Vercel
- No database, no API routes, no serverless functions in Phase 1

Next.js was chosen over Astro specifically because Sanity's Presentation tool and visual editing
integration are best supported there, and click-to-edit authoring is a core requirement for the
client handoff.

## Dependency discipline

This client will not be on a retainer after launch. Every dependency is a future upgrade that
someone has to own, and the person who owns it may not be the person who added it.

Avoid component libraries, animation libraries, icon packages, date libraries, and utility
grab-bags. Prefer a small amount of hand-written code over a package. If a dependency genuinely
seems necessary, raise it for discussion rather than adding it.

The target is a dependency tree small enough that an annual refresh is a couple of hours.

## Deployment and version control

Git operations are performed manually by the developer. Do not run `git` commands, create commits,
or push. Leave changes in the working tree.

## Design tokens

All colors, type sizes, and spacing come from tokens in `app/globals.css`. Never hardcode a hex
value, a px font size, or an arbitrary margin in a component.

### Color rule (non-negotiable — accessibility)

Most of the brand palette fails WCAG AA contrast against white text. Measured ratios drove this rule:

- **White text on `pine` only** (`#416625`, 6.66:1).
- **Ink text (`#1a1a1a`) on every other brand color.** All pass comfortably, 4.5:1 to 11.7:1.
- **Buttons use `--color-action` (`#256093`)**, a darkened ocean at 6.62:1. Never the original
  `#3c8dce`, which is 3.56:1 and fails at button text size.
- Never use pine as a _text_ color on a brand-colored background (pine on mint is 3.10:1).

If a design direction would put white text on mint, sky, sunshine, lime, flamingo, seafoam,
tangerine, tomato, or ocean, flag it rather than implementing it. Treehouse is a place of public
accommodation and the primary audience reads on phones, often outdoors.

### Typography roles

- **Script (Betania Patmos):** display headlines and section band headings only. Never below ~28px,
  never body copy, never UI.
- **Serif (Libre Baskerville):** body copy and editorial headings.
- **Sans (Quicksand):** buttons, nav, labels, captions, prices.

Body copy never renders below 16px on any viewport.

All three are self-hosted at build time by `next/font/google` in `app/layout.tsx`, which sets the
`--font-script` / `--font-serif` / `--font-sans` variables on `<html>`. Nothing is fetched from
Google at runtime. Betania Patmos has no published fallback metrics, so script headings shift
slightly on load; the other two have metric-matched fallbacks and do not.

### Script subsection headings

The brand guide is specified in points, not pixels. At 1pt = 1.333px its script heading is 28px on
mobile (21pt) and 43px on desktop (32pt) — so it clears the 28px floor at both breakpoints, and
script is correct for subsection headings: "built for play that matters", "the classic", "pick your
room", "drop us a line" and similar.

These use `--text-script-sm`, which is clamped so it cannot fall below 28px. **28px is a hard floor
for the script face.** Anything that needs to render smaller uses Quicksand instead — there is no
small script, at any breakpoint.

Section band headings are larger still and sit at display scale. Some band colors only clear
contrast at the large-text threshold — white on ocean is 3.56:1, which passes the 3:1 large-text
bar and nothing else — so a band's `mobileHeading` is a *shorter* string, never a smaller one.

### The client brand guide's type scale is not authoritative

The supplied brand guide has an inverted scale (H2 24pt, H3 28pt, H4 32pt — each level larger than
the one above it), on both desktop and mobile. The tokens in this repo are the corrected scale.
Ignore the guide's numbers.

## Accessibility baseline

- Semantic HTML. One `<h1>` per page, no skipped heading levels. Exactly two blocks produce an h1:
  `hero` (its `overlayHeadline`, on the homepage) and `pageHeader` (its `title`, on sub-pages).
  Section bands are always h2 no matter how large they look — display styling never becomes the h1
  by accident. `getPage()` warns in development when a page has anything other than one h1 source.
- Visible `:focus-visible` styles on every interactive element. Never remove outlines without
  replacing them.
- Minimum 44×44px touch targets.
- Alt text on every image. Decorative elements get `alt=""` and `aria-hidden="true"`.
- Respect `prefers-reduced-motion`.

## Mobile

Mobile-first. The client supplied no mobile designs, so these decisions are ours and are documented
in the design system doc. The load-bearing ones:

- Section band script headings need an optional shorter `mobileHeading`. Long script headlines are
  illegible at 375px.
- Image + text splits always stack image-above-text, regardless of desktop side, for consistent
  reading order.
- Decorative accents (squiggles, loops, flowers) are `display: none` below 768px, not repositioned.
  They are atmosphere, not content.
- Price badge circles become full-width cards below 640px.

## Block components

Pages are composed from a fixed set of block components. The union is defined in
`/types/content.ts`. Each block:

- Takes a single typed props object matching its content type
- Renders correctly when optional fields are empty — no broken intermediate states, since the
  client will be editing these live in Phase 2
- Accepts variant and color props as constrained string-literal unions, never an arbitrary string
- Lives in `/components/blocks/<BlockName>.tsx`

The constrained unions are deliberate. In Phase 2 these become the author's only styling controls:
no color pickers, no font or spacing controls, no raw HTML.

## Conventions

- Functional components, named exports, TypeScript strict mode
- Comments explain _why_, not _what_. No comment restating the line below it.
- Prefer clarity over cleverness. This code needs to be readable by a future developer who did not
  write it.

## Placeholders currently in play

Logo, icon set, and decorative SVGs are placeholders pending final brand files. Photography for the
party rooms and cafe is not final. Avoid building anything that assumes final assets, and keep
image swaps to a single file change where possible.
