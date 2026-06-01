/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  transpilePackages: ['gsap'],
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/#about',
        permanent: true,
      },
      {
        source: '/contact',
        destination: '/#contact',
        permanent: true,
      },
      {
        source: '/projects',
        destination: '/#projects',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
