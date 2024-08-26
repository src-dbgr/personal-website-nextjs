const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: 'res.cloudinary.com' },
    ],
    unoptimized: true,
  },
  env: {
    STRAPI_GRAPHQL_URL: process.env.STRAPI_GRAPHQL_URL,
    STRAPI_TOKEN: process.env.STRAPI_TOKEN,
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  },
  async headers() {
    const headers = [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: process.env.NODE_ENV === 'development' 
              ? "default-src 'self'; script-src 'self' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com; img-src 'self' data: https://www.google-analytics.com https://res.cloudinary.com; style-src 'self' 'unsafe-inline'; frame-ancestors 'none'; form-action 'self' https://formspree.io;"
              : "default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com; img-src 'self' data: https://www.google-analytics.com https://res.cloudinary.com; style-src 'self' 'unsafe-inline'; frame-ancestors 'none'; form-action 'self' https://formspree.io;"
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'no-referrer-when-downgrade',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];

    return headers;
  },
};

export default nextConfig;