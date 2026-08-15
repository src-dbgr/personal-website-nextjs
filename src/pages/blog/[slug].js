import React from "react";
import Layout from "../../components/general/Layout";
import Title from "../../components/general/Title";
import ReactMarkdown from "react-markdown";
import Seo from "../../components/general/Seo";
import Link from "next/link";
import { fetchBlogBySlug, fetchBlogPaths } from "../../lib/strapi";
import { fetchCookieStaticProps } from "../../lib/staticPropsHelpers";
import FadeInSection from "../../hooks/FadeInSectionClient";

const markdownComponents = {
  a: ({ href, children }) => {
    const external = href && /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        className="blog-inline-link"
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {children}
      </a>
    );
  },
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt || ""}
      width={480}
      height={480}
      loading="lazy"
    />
  ),
};

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
              <ReactMarkdown components={markdownComponents}>
                {content}
              </ReactMarkdown>
              <Link href="/blog" className="btn center-btn">
                <span className="btn">all blogs</span>
              </Link>
            </article>
          </div>
        </FadeInSection>
      </section>
    </Layout>
  );
};

export async function getStaticPaths() {
  const paths = await fetchBlogPaths();
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const [blog, { cookies }] = await Promise.all([
    fetchBlogBySlug(params.slug),
    fetchCookieStaticProps(),
  ]);

  if (!blog) {
    return { notFound: true };
  }

  return {
    props: {
      blog,
      cookies,
    },
  };
}

export default BlogTemplate;
