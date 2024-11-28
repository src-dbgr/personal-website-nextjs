import { gql } from '@apollo/client';
import apolloClient from './apolloClient';

export const GET_COOKIES = gql`
  query GetCookies {
    cookies(filters: { active: { eq: true } }, sort: "identifier:desc") {
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
`;

export async function fetchCookieStaticProps() {
  try {
    const { data } = await apolloClient.query({
      query: GET_COOKIES,
    });

    if (!data || !data.cookies) {
      console.error('Unexpected data structure:', data);
      return { cookies: [] };
    }

    const cookies = data.cookies;

    return {
      cookies,
    };
  } catch (error) {
    console.error('Error fetching cookies:', error);
    return { cookies: [] };
  }
}