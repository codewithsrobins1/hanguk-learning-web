import type { NextConfig } from 'next';
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // only active in production
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {};

module.exports = withPWA(nextConfig);
