const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@healthcare/shared': path.resolve(__dirname, '../../packages/shared/src')
    };
    return config;
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'development' 
          ? 'http://localhost:4000/api/:path*'
          : `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
        basePath: false
      }
    ]
  }
};

module.exports = nextConfig;