/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export enabled for S3 + CloudFront deployment
  output: 'export',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
