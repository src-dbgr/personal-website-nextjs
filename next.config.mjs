/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: 'res.cloudinary.com' },
    ],
  },
};

export default nextConfig;
