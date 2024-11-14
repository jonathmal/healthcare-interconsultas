// healthcare-interconsultas/apps/web/next.config.js
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
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*',  // Changed to port 4000
        basePath: false
      }
    ]
  }
};

module.exports = nextConfig;