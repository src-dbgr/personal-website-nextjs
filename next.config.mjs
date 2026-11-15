import bundleAnalyzer from '@next/bundle-analyzer';
import { getCspContent } from './src/lib/csp.mjs';

const isDev = process.env.NODE_ENV === 'development';
const WEBMCP_ORIGIN_TRIAL =
  "AqdG3sNelgx2pRAm+8v28szavpsmU6c/GLz0seeSO5dgHyBam7Hd1Rm6xVbYasjh2atiKc/rkWQ0cQTD2eRdFwsAAABJeyJvcmlnaW4iOiJodHRwczovL2RldnNhbS5pbzo0NDMiLCJmZWF0dXJlIjoiV2ViTUNQIiwiZXhwaXJ5IjoxODA2MzY0ODAwfQ==";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  agentRules: false,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    qualities: [75, 90],
    // Only our own Cloudinary accounts, so the image endpoint cannot be
    // used to proxy images from other accounts.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dwqb9oegd/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dqalsnm35/**",
      },
    ],
    // unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID:
      process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  },
  async headers() {
    return [
      {
        source: "/((?!_next/static/development/).*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
          {
            key: "Content-Security-Policy",
            value: getCspContent({ dev: isDev }),
          },
          {
            // Chrome origin trial for WebMCP (src/lib/webmcp.js), registered
            // for https://devsam.io; expires 30 Mar 2027, renew it on
            // developer.chrome.com/origintrials. Public, not a secret.
            key: "Origin-Trial",
            value: WEBMCP_ORIGIN_TRIAL,
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);