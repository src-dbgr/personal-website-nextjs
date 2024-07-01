import React from 'react';
import { gql } from '@apollo/client';
import apolloClient from '../lib/apolloClient';
import Layout from '../components/general/Layout';
import Seo from '../components/general/Seo';
import Title from '../components/general/Title';
import Blog from '../components/06_blog/Blog';
import { fetchCookieStaticProps } from '../lib/staticPropsHelpers';

const GET_BLOGS = gql`
  query GetBlogs {
    blogs(pagination: {pageSize: 1000},sort: ["date:desc"]) {
      data {
        id
        attributes {
          slug
          desc
          date
          title
          content
          category
          image {
            data {
              attributes {
                url
              }
            }
          }
        }
      }
    }
  }
`;

const BlogPage = ({ blogs, cookies }) => { // cookies als Prop hinzufügen
  return (
    <Layout darkFooter={true} cookies={cookies}>
      <Seo
        title="Blog"
        description="Samuel IT - Discover the latest IT blog articles I have published."
      />
      <section className="blog-page">
        <Title title="All Blog Articles" />
        <div className="section-center blogs-center">
          {blogs.map((blog) => {
            return <Blog key={blog.id} {...blog} />;
          })}
        </div>
      </section>
    </Layout>
  );
};

export async function getStaticProps() {
  const { data } = await apolloClient.query({
    query: GET_BLOGS,
  });

  const blogs = data.blogs.data.map((blog) => ({
    id: blog.id,
    ...blog.attributes,
    image: blog.attributes.image.data.attributes,
  }));

  const { cookies } = await fetchCookieStaticProps(); // Cookies Daten abfragen

  return {
    props: {
      blogs,
      cookies, // Cookies Daten übergeben
    },
    revalidate: 10, // Optional: Setzt die Revalidierungszeit für die statische Seite
  };
}

export default BlogPage;
