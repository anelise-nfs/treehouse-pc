import type { NextConfig } from "next";

// Deliberately NOT `output: "export"`. Static export removes the server, which
// disables Draft Mode, which Sanity's Presentation tool requires in Phase 2.
// Default static rendering still prerenders every page at build time.
const nextConfig: NextConfig = {
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
