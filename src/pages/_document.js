import Document, { Html, Head, Main, NextScript } from "next/document";
import { getCspContent } from "../lib/csp";

class MyDocument extends Document {
  render() {
    return (
      <Html className="theme-pending">
        <Head>
          <style>{"html.theme-pending{visibility:hidden}"}</style>
          <meta httpEquiv="Content-Security-Policy" content={getCspContent()} />
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
        </Head>
        <body>
          {/* Blocking, CSP 'self': apply saved theme before Main paints. */}
          <script src="/theme-init.js" />
          <noscript>
            <style>
              {
                ".fade-in-section{opacity:1;transform:none;visibility:visible}"
              }
            </style>
          </noscript>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
