import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import siteMetadata from '../../../seo.config';

// Default share image (public/og2.png) is 1200x630.
const DEFAULT_IMAGE_WIDTH = 1200;
const DEFAULT_IMAGE_HEIGHT = 630;

const toAbsoluteUrl = (siteUrl, path) =>
  /^https?:\/\//.test(path) ? path : `${siteUrl}${path}`;

// Keeps "<" out of the inline JSON so it cannot close the script tag.
const toJsonLd = (data) => JSON.stringify(data).replace(/</g, '\\u003c');

const Seo = ({
  title,
  description,
  type = 'website',
  publishedTime,
  modifiedTime,
  noindex = false,
}) => {
  const { asPath } = useRouter();
  const {
    title: siteTitle,
    description: siteDesc,
    siteUrl,
    image,
    twitterUsername,
  } = siteMetadata;

  const path = (asPath || '/').split(/[?#]/)[0].replace(/\/$/, '');
  const url = path ? `${siteUrl}${path}` : siteUrl;
  const imageUrl = toAbsoluteUrl(siteUrl, image);
  const pageTitle = title || siteTitle;
  const pageDesc = description || siteDesc;
  const isArticle = type === 'article';

  const person = {
    '@type': 'Person',
    '@id': `${siteUrl}/#person`,
    name: 'Samuel',
    url: siteUrl,
    jobTitle: 'Senior Software Developer',
    sameAs: [
      'https://github.com/src-dbgr',
      'https://bsky.app/profile/devsam.bsky.social',
      'https://x.com/smlblm',
    ],
  };

  let jsonLd = null;
  if (isArticle) {
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: pageTitle,
      description: pageDesc,
      url,
      mainEntityOfPage: url,
      image: imageUrl,
      author: person,
      ...(publishedTime && { datePublished: publishedTime }),
      ...(modifiedTime && { dateModified: modifiedTime }),
    };
  } else if (!path) {
    jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${siteUrl}/#website`,
          name: siteTitle,
          url: siteUrl,
          description: siteDesc,
          inLanguage: 'en',
          publisher: { '@id': `${siteUrl}/#person` },
        },
        person,
      ],
    };
  }

  return (
    <Head>
      <title>{title ? `${title} | ${siteTitle}` : siteTitle}</title>
      <meta name="description" content={pageDesc} />
      {!noindex && <link rel="canonical" href={url} />}

      <meta property="og:title" content={pageTitle} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content={String(DEFAULT_IMAGE_WIDTH)} />
      <meta property="og:image:height" content={String(DEFAULT_IMAGE_HEIGHT)} />
      <meta property="og:image:alt" content={siteTitle} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={isArticle ? 'article' : 'website'} />
      <meta property="og:locale" content="en_US" />
      {isArticle && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {isArticle && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterUsername} />
      <meta name="twitter:creator" content={twitterUsername} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDesc} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={siteTitle} />

      <meta
        name="robots"
        content={
          noindex
            ? 'noindex, follow'
            : 'index, follow, max-snippet:-1, max-image-preview:large'
        }
      />

      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(jsonLd) }}
        />
      )}
    </Head>
  );
};

export default Seo;
