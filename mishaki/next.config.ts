import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.0.172', 'localhost:3000'],
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/backend-uploads/:path*',
        destination: 'http://127.0.0.1:8000/uploads/:path*' // Proxy to Backend
      }
    ]
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
