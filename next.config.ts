import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@anima/shared"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "3000", pathname: "/home-testimonials/photos/**" },
      { protocol: "https", hostname: "emotivecare.com.br", pathname: "/home-testimonials/photos/**" },
      { protocol: "https", hostname: "api.emotivecare.com.br", pathname: "/home-testimonials/photos/**" },
    ],
  },
  experimental: {
    optimizePackageImports: ["motion/react"],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.emotivecare.com.br" }],
        destination: "https://emotivecare.com.br/:path*",
        permanent: true,
      },
      {
        source: "/planos",
        destination: "/plans",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
