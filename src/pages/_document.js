import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/fav.png" />
        <link rel="apple-touch-icon" href="/fav.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3d8b68" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
