import React from "react";
import Head from 'next/head';
// import { useStaticQuery, graphql } from "gatsby";

// const query = graphql`
//   {
//     site {
//       siteMetadata {
//         author
//         siteDesc: description
//         image
//         siteUrl
//         siteTitle: title
//         twitterUsername
//       }
//     }
//   }
// `;
const Seo = ({ title, description, siteTitle, image, twitterUsername, siteUrl }) => {
  return (
    <Head>
      <title>{title || siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="image" content={image} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterUsername} />
      <meta name="twitter:creator" content={twitterUsername} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${image}`} />
    </Head>
  );
};

export default Seo;