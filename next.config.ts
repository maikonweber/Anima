import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["motion/react"],
  },
  async redirects() {
    return [
      {
        source: "/planos",
        destination: "/assinatura",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
