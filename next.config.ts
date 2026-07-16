import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow cross-origin requests during development (Playwright tests)
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  // Remote image domains
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
    // Disable Next.js Image Optimization - use native <img> tags instead
    unoptimized: true,
  },
};

export default nextConfig;
