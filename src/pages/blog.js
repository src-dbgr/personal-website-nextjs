import React from 'react';
import { gql, useQuery } from '@apollo/client';
import Layout from '../components/general/Layout';
import Seo from '../components/general/Seo';
import Title from '../components/general/Title';
import Blog from '../components/06_blog/Blog';

const GET_BLOGS = gql`
  query Techstacks {
    blogs(sort: ["date:desc"]) {
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

const BlogPage = () => {
  const { loading, error, data } = useQuery(GET_BLOGS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const blogs = data.blogs.data.map((blog) => ({
    id: blog.id,
    ...blog.attributes,
    image: blog.attributes.image.data.attributes,
  }));

  return (
    <Layout darkFooter={true}>
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

export default BlogPage;
