/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: 'res.cloudinary.com' },
    ],
  },
  env: {
    STRAPI_GRAPHQL_URL: process.env.STRAPI_GRAPHQL_URL,
    STRAPI_TOKEN: process.env.STRAPI_TOKEN,
  },
};

export default nextConfig;
