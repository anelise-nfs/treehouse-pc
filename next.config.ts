import type { NextConfig } from "next";

// Deliberately NOT `output: "export"`. Static export removes the server, which
// disables Draft Mode, which Sanity's Presentation tool requires in Phase 2.
// Default static rendering still prerenders every page at build time.
const nextConfig: NextConfig = {
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: false },

  /**
   * /early-bird is gone — the founding memberships sold out and the page went
   * with them. This is here because that URL was promoted: it sat second in
   * the sitemap at priority 0.9, it was in every navigation, and it is the
   * link that went out with the sale in email, on Instagram and in the
   * TownLift piece. Deleting the route without this turns all of that into
   * 404s, and search engines into reporting one.
   *
   * To the homepage's membership section rather than to the homepage, because
   * the copy explaining that the sale has closed is in that section. Someone
   * arriving from an old link gets the answer to the question they clicked
   * with instead of a page that silently no longer mentions it.
   *
   * `permanent: true` is a 308, not a 301 — Next uses 307/308 so the request
   * method survives the redirect. Either way it tells a crawler to drop the
   * old URL and cache this.
   *
   * REDIRECTS NEED THE SERVER, which is the same reason the note above keeps
   * `output: "export"` off. A static export would ignore this block entirely
   * and the 404s would come back without anything failing at build time.
   */
  async redirects() {
    return [{ source: '/early-bird', destination: '/#memberships', permanent: true }];
  },
};

export default nextConfig;
