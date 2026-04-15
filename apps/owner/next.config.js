const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@lafattoria/ui', '@lafattoria/supabase', '@lafattoria/utils'],
};

module.exports = withPWA(nextConfig);
