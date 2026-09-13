import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.0.172', 'localhost:3000'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
