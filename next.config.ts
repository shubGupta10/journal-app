import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },
  
  reactStrictMode: true,
  
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },
  
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-dialog",
    ],
  },
};

export default nextConfig;
