import React, { useRef } from "react";
import Layout from "../../components/general/Layout";
import Title from "../../components/general/Title";
import ReactMarkdown from "react-markdown";
import Seo from "../../components/general/Seo";
import Link from "next/link";
import { fetchBlogBySlug, fetchBlogPaths } from "../../lib/strapi";
import { fetchCookieStaticProps } from "../../lib/staticPropsHelpers";
import FadeInSection from "../../hooks/FadeInSectionClient";
import CopyTextButton from "../../components/06_blog/CopyTextButton";

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
      className={src?.endsWith(".svg") ? "blog-diagram" : undefined}
      width={480}
      height={480}
      loading="lazy"
    />
  ),
};

const BlogTemplate = ({ blog, cookies }) => {
  const { content, title, desc, date, updatedAt } = blog;
  const bodyRef = useRef(null);

  return (
    <Layout darkFooter={false} cookies={cookies}>
      <Seo
        title={title}
        description={desc}
        type="article"
        publishedTime={date}
        modifiedTime={updatedAt}
      />
      <section className="blog-template">
        <Title title={title} />
        <FadeInSection>
          <div className="section-center">
            <article className="blog-content">
              <CopyTextButton sourceRef={bodyRef} title={title} />
              <div className="blog-article-body" ref={bodyRef}>
                <ReactMarkdown components={markdownComponents}>
                  {content}
                </ReactMarkdown>
              </div>
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
