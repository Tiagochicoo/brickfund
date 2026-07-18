import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.brick-fund.com',
        pathname: '/api/files/**',
      },
    ],
  },
  // Allow cross-origin HMR for development
  allowedDevOrigins: ['www.brick-fund.com', 'brick-fund.com', 'localhost'],
};

export default nextConfig;
