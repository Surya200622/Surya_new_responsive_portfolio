/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  transpilePackages: ['gsap'],
  async redirects() {
    return [];
  },
};

export default nextConfig;
