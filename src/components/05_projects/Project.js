import React, { useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image"; // Next.js image component
import { FaGithubSquare } from "react-icons/fa";
import { BsCircleFill } from "react-icons/bs";
import { IoTriangleSharp } from "react-icons/io5";
import dynamic from 'next/dynamic';

const FadeInSection = dynamic(() => import("../../hooks/FadeInSection"), {
  ssr: false,
  loading: () => <div>Loading ...</div>, // optionaler Fallback
});

const Project = ({ image, title, description, github, stack, url, index }) => {
  const [active, setActive] = useState(false);

  function flipActivation() {
    setActive((active) => !active);
  }

  return (
    <FadeInSection>
      <div className={index % 2 === 0 ? "project" : "project even"}>
        <div
          className={
            active ? "project-img-wrapper project-z-index project-img-wrapper-active" : "project-img-wrapper"
          }
          onClick={flipActivation}
          onKeyDown={flipActivation}
          role="presentation"
        >
          {image && (
            <Image
              src={image?.url ?? image?.data?.attributes?.url} // Pfad zur Bildquelle, eventuell anpassen
              className={active ? "project-img-active shadow-box-dark" : "project-img shadow-box-dark"}
              alt={title}
              width={772} // Passende Breite setzen
              height={471} // Passende Höhe setzen
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "471px",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          )}
        </div>
        <div className="project-info shadow-box-dark">
          <span className="project-number">
            {index % 2 === 0 ? <BsCircleFill /> : <IoTriangleSharp />}
          </span>
          <h3>{title || "Title Prop not set"}</h3>
          <p className="project-desc">{description}</p>
          <div className="project-stack">
            {stack.map((item) => {
              return <span key={item.id}>{item.title}</span>;
            })}
          </div>
          <div className="project-links">
            <a href={github}>
              <FaGithubSquare className="project-icon" />
              <p>
                GITHUB{" "}
                {String(github.match("[^/]+(?=/$|$)"))
                  .replace(/-/g, " ")
                  .toUpperCase()}
              </p>
            </a>
          </div>
          {url.includes("github") && (
            <div className="project-links">
              <a href={url}>
                <FaGithubSquare className="project-icon" />
                <p>
                  GITHUB{" "}
                  {String(url.match("[^/]+(?=/$|$)"))
                    .replace(/-/g, " ")
                    .toUpperCase()}
                </p>
              </a>
            </div>
          )}
        </div>
      </div>
    </FadeInSection>
  );
};

Project.propTypes = {
  title: PropTypes.string.isRequired,
  github: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.object.isRequired,
  stack: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Project;
