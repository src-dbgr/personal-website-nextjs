/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: 'res.cloudinary.com' },
    ],
    unoptimized: true, // Füge diese Zeile hinzu
  },
  env: {
    STRAPI_GRAPHQL_URL: process.env.STRAPI_GRAPHQL_URL,
    STRAPI_TOKEN: process.env.STRAPI_TOKEN,
  },
  // output: 'export',
};

export default nextConfig;
