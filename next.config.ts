import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Quality tiers used by AssetImage (78 default, 85 lightbox) + next/image default.
    qualities: [75, 78, 85],
  },
};

export default nextConfig;
