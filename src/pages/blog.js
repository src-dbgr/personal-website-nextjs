import React from "react";
import Layout from "../components/general/Layout";
import Seo from "../components/general/Seo";
import Title from "../components/general/Title";
import Blog from "../components/06_blog/Blog";
import { fetchBlogs } from "../lib/strapi";
import { fetchCookieStaticProps } from "../lib/staticPropsHelpers";

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
  const [blogs, { cookies }] = await Promise.all([
    fetchBlogs(),
    fetchCookieStaticProps(),
  ]);

  return {
    props: {
      blogs,
      cookies,
    },
  };
}

export default BlogPage;