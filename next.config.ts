import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/favicon.ico",
        destination: "/logo-mdmc.png",
      },
    ];
  },
};

export default nextConfig;
