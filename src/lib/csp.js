export function getCspContent() {
  const policy = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "'unsafe-eval'",
      "https://www.google.com",
      "https://www.gstatic.com",
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
          ],
    "frame-src": ["https://www.google.com"],
    "connect-src": [
      "'self'",
      "https://formspree.io",
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
    "style-src": ["'self'", "'unsafe-inline'", "https://www.gstatic.com"],
    "form-action": ["'self'", "https://formspree.io"],
  };

  return Object.entries(policy)
    .map(([key, values]) => `${key} ${values.join(" ")}`)
    .join("; ");
}