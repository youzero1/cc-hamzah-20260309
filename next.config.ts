import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['typeorm', 'better-sqlite3'],
  },
};

export default nextConfig;
