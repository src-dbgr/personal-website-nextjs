import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html className="theme-pending" lang="en">
        <Head>
          <style>{"html.theme-pending{visibility:hidden}"}</style>
          {/* The Content-Security-Policy is sent as a header (next.config.mjs). */}
          {/* Blocking, CSP 'self': set the theme class on <html> before first paint. */}
          <script src="/theme-init.js" />
          {/* Favicon and manifest links */}
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/assets/images/icons/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/assets/images/icons/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/assets/images/icons/favicon-16x16.png"
          />
          <link rel="icon" href="/favicon.ico" />
          <link rel="manifest" href="/manifest.json" />
          <link
            rel="alternate"
            type="application/rss+xml"
            title="Samuel IT – Blog"
            href="/rss.xml"
          />
          {/* <style> is only valid in <noscript> inside <head>. */}
          <noscript>
            <style>
              {
                ".fade-in-section{opacity:1;transform:none;visibility:visible}html:not(.launch-seen) .persistent-chrome{visibility:visible;opacity:1;pointer-events:auto}html:not(.launch-seen) #main-content,html:not(.launch-seen) .footer{visibility:visible;opacity:1;animation:none}"
              }
            </style>
          </noscript>
        </Head>
        <body>
          {/* Blocking, CSP 'self': apply saved theme before Main paints. */}
          <script src="/theme-init.js" />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
