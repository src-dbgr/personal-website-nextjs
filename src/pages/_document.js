import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Favicon and manifest links */}
          <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/icons/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/icons/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/assets/images/icons/favicon-16x16.png" />
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
