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
        hostname: 'api-brickfund.t-pereira.com',
        pathname: '/api/files/**',
      },
    ],
  },
  // Allow cross-origin HMR for development
  allowedDevOrigins: ['brickfund.t-pereira.com'],
};

export default nextConfig;