import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Image from "next/image";
import FadeInSection from "../../hooks/FadeInSectionClient";

const Blog = ({ title, desc, slug, date, category, image }) => {
  return (
    <FadeInSection>
      <Link href={`/blog/${slug}`} className="blog shadow-box-dark">
        <article className="blog-img-parent">
          <div className="rounded-img-child">
            <Image
              className="blog-img"
              src={image.url}
              alt={title}
              width={100}
              height={100}
              style={{ width: "auto", aspectRatio: "1 / 1" }}
            />
          </div>
          <div className="blog-card">
            <h4>{title}</h4>
            <p className="blog-description">{desc}</p>
            <div className="blog-footer-parent">
              <div className="blog-footer">
                <p>{category}</p>
                <p>{date}</p>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </FadeInSection>
  );
};

Blog.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  image: PropTypes.object.isRequired,
};

export default Blog;
