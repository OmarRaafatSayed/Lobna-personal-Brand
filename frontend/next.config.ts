import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost' },
      { protocol: 'https', hostname: '**' },
    ],
  },
  // Only proxy /uploads in development; in production uploads are served from backend directly
  ...(isProd ? {} : {
    async rewrites() {
      return [
        {
          source: '/uploads/:path*',
          destination: `${backendUrl}/uploads/:path*`,
        },
      ]
    },
  }),
};

export default nextConfig;
