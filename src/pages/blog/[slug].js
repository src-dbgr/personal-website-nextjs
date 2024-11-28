import React from 'react';
import { gql } from '@apollo/client';
import apolloClient from '../../lib/apolloClient';
import Layout from '../../components/general/Layout';
import Title from '../../components/general/Title';
import ReactMarkdown from 'react-markdown';
import Seo from '../../components/general/Seo';
import FadeInSection from '../../hooks/FadeInSection';
import Link from 'next/link';
import { fetchCookieStaticProps } from '../../lib/staticPropsHelpers';

const GET_BLOG_BY_SLUG = gql`
  query GetBlogBySlug($slug: String!) {
    blogs(filters: { slug: { eq: $slug } }) {
      content
      title
      desc
      slug
      documentId
    }
  }
`;

const GET_ALL_BLOGS = gql`
  query GetAllBlogs {
    blogs {
      slug
      documentId
    }
  }
`;

const BlogTemplate = ({ blog, cookies }) => { 
  const { content, title, desc } = blog;

  return (
    <Layout darkFooter={false} cookies={cookies}>
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

  const paths = data.blogs.map((blog) => ({
    params: { slug: blog.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { data } = await apolloClient.query({
    query: GET_BLOG_BY_SLUG,
    variables: { slug: params.slug },
  });

  const blog = data.blogs[0];

  const { cookies } = await fetchCookieStaticProps();

  return {
    props: { 
      blog,
      cookies,
    },
  };
}

export default BlogTemplate;