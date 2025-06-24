import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.me-south-1.amazonaws.com',
        pathname: '/storage.siarty.com/**',
      },
    ],
  },
};

export default nextConfig;
