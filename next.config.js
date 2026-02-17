/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true
  },
  swcMinify: true,
  experimental: {
    optimizeCss: true
  }
}

module.exports = nextConfig
