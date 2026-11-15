// Content Security Policy, sent as an HTTP header (see next.config.mjs).
// `dev` relaxes script-src for `next dev` only: Fast Refresh needs eval and
// an inline bootstrap script. Production builds never get these.
export function getCspContent({ dev = false } = {}) {
  const policy = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      ...(dev ? ["'unsafe-eval'", "'unsafe-inline'"] : []),
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
    ],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "connect-src": [
      "'self'",
      "https://submit-form.com",
      "https://api.botpoison.com",
      "https://www.google-analytics.com",
      "https://*.google-analytics.com",
      "https://res.cloudinary.com",
      "https://*.cloudinary.com",
    ],
    "img-src": [
      "'self'",
      "data:",
      "https://www.google-analytics.com",
      "https://res.cloudinary.com",
    ],
    "style-src": ["'self'", "'unsafe-inline'"],
    "form-action": ["'self'"],
    // Only honoured in a header, not in a <meta> tag.
    "frame-ancestors": ["'none'"],
  };

  return Object.entries(policy)
    .map(([key, values]) => `${key} ${values.join(" ")}`)
    .join("; ");
}
