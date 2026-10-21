/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['sharp', 'mongoose', 'bcryptjs'],
  },
}
module.exports = nextConfig
