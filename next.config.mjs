/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "minio.cloudian.in.th",
        pathname: "/old-school-ig/**",
      },
      {
        protocol: "https",
        hostname: "minio",
        pathname: "/old-school-ig/**",
      },
    ],
  },
};

export default nextConfig;
