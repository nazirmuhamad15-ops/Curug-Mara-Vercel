import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "zekpaionajqjlrcixfjg.supabase.co",
      },
    ],
  },
  productionBrowserSourceMaps: false,
  reactStrictMode: false,
};

export default nextConfig;
