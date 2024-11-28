import React from 'react';
import Head from 'next/head';
import siteMetadata from '../../../seo.config';

const Seo = ({ title, description }) => {
  const {
    title: siteTitle,
    description: siteDesc,
    siteUrl,
    image,
    twitterUsername,
  } = siteMetadata;

  return (
    <Head>
      <title>{title ? `${title} | ${siteTitle}` : siteTitle}</title>
      <meta name="description" content={description || siteDesc} />
      <meta name="image" content={image} />

      <meta property="og:title" content={title || siteTitle} />
      <meta property="og:site_name" content="Samuel IT" />
      <meta property="og:description" content={description || siteDesc} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterUsername} />
      <meta name="twitter:creator" content={twitterUsername} />
      <meta name="twitter:title" content={title || siteTitle} />
      <meta name="twitter:description" content={description || siteDesc} />
      <meta name="twitter:image" content={`${siteUrl}${image}`} />

      <meta
        name="robots"
        content="index, follow, max-snippet:[120], max-image-preview:[large]"
      />
      <meta name="google-site-verification" content="" />
    </Head>
  );
};

export default Seo;
