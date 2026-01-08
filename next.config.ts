import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
    // Enable modern image formats for better compression
    formats: ["image/avif", "image/webp"],
    // Reduce image sizes for faster loading
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // Minimize image cache for faster updates during development
    minimumCacheTTL: 60,
  },

  // Build optimizations
  typescript: {
    ignoreBuildErrors: true,
  },

  // Experimental performance features
  experimental: {
    // ✅ Enable Partial Prerendering for faster page loads
    ppr: "incremental",
    // Enable package optimization
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "framer-motion",
      "motion",
      "recharts",
      "date-fns",
    ],
  },

  // Compression
  compress: true,
};

export default nextConfig;

