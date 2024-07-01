// lib/staticPropsHelpers.js
import { gql } from '@apollo/client';
import apolloClient from './apolloClient';

export const GET_COOKIES = gql`
  query GetCookies {
    cookies(filters: { active: { eq: true } }, sort: "identifier:desc") {
      data {
        attributes {
          name
          purpose
          selectable
          title
          type
          url
          vendor
          description
          expiration
          enablealltoggle
          category {
            category
          }
          identifier
        }
      }
    }
  }
`;

export async function fetchCookieStaticProps() {
  const { data: cookiesData } = await apolloClient.query({
    query: GET_COOKIES,
  });

  const cookies = cookiesData.cookies.data.map(item => item.attributes);

  return {
    cookies,
  };
}
