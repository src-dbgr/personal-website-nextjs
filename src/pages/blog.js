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
    blogs(pagination: {pageSize: 1000}, sort: ["date:desc"]) {
      slug
      desc
      date
      title
      content
      category
      documentId
      image {
        url
      }
    }
  }
`;

const BlogPage = ({ blogs, cookies }) => {
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
            return <Blog key={blog.documentId} {...blog} />;
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

  const blogs = data.blogs.map((blog) => ({
    ...blog,
    id: blog.documentId // Behalte id für Kompatibilität, aber nutze documentId
  }));

  const { cookies } = await fetchCookieStaticProps();

  return {
    props: {
      blogs,
      cookies,
    }
  };
}

export default BlogPage;