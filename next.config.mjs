/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'minio.cloudian.in.th',
        pathname: '/old-school-ig/**',
      },
    ],
  },
};

export default nextConfig;
