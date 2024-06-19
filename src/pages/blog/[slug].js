import React from 'react';
import { gql } from '@apollo/client';
import apolloClient from '../../lib/apolloClient';
import Layout from '../../components/general/Layout';
import Title from '../../components/general/Title';
import ReactMarkdown from 'react-markdown';
import Seo from '../../components/general/Seo';
import FadeInSection from '../../hooks/FadeInSection';
import Link from 'next/link';

const GET_BLOG_BY_SLUG = gql`
  query GetBlogBySlug($slug: String!) {
    blogs(filters: { slug: { eq: $slug } }) {
      data {
        attributes {
          content
          title
          desc
          slug
        }
      }
    }
  }
`;

const GET_ALL_BLOGS = gql`
  query GetAllBlogs {
    blogs {
      data {
        attributes {
          slug
        }
      }
    }
  }
`;

const BlogTemplate = ({ blog }) => {
  const { content, title, desc } = blog.attributes;

  return (
    <Layout darkFooter={false}>
      <Seo title={title} description={desc} />
      <section className="blog-template">
        <Title title={title} />
        <FadeInSection>
          <div className="section-center">
            <article className="blog-content">
              <ReactMarkdown>{content}</ReactMarkdown>
              <Link href="/blog" legacyBehavior>
                <a className="btn center-btn">
                  <span className="btn">all blogs</span>
                </a>
              </Link>
            </article>
          </div>
        </FadeInSection>
      </section>
    </Layout>
  );
};

export async function getStaticPaths() {

    const { data } = await apolloClient.query({ query: GET_ALL_BLOGS });

  const paths = data.blogs.data.map((blog) => ({
    params: { slug: blog.attributes.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {

  const { data } = await apolloClient.query({
    query: GET_BLOG_BY_SLUG,
    variables: { slug: params.slug },
  });

  const blog = data.blogs.data[0];

  return {
    props: { blog },
  };
}

export default BlogTemplate;
