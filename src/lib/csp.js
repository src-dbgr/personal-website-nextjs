export function getCspContent() {
  const policy = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
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
  };

  return Object.entries(policy)
    .map(([key, values]) => `${key} ${values.join(" ")}`)
    .join("; ");
}