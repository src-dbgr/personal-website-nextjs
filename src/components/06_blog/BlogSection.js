import React from "react";
import Title from "../general/Title";
import Blog from "./Blog";
import Link from "next/link";

export const BlogsSection = ({ blogs, title, showLink }) => {
  return (
    <section id="sctn_blog" className="section">
      <Title title={title} />
      <div className="section-center blogs-center">
        {blogs.map((blog) => {
          return <Blog key={blog.createdAt} {...blog} />;
        })}
      </div>
      {showLink && (
        <Link href="/blog" legacyBehavior>
          <a className="btn center-btn">All Blog Articles</a>
        </Link>
      )}
    </section>
  );
};
export default BlogsSection;
