import React from "react";
import Title from "../general/Title";
import Link from "next/link"; // Verwendung von next/link statt gatsby
import Project from "./Project";

const Projects = ({ projects, title, showLink }) => {
  return (
    <section id="sctn_projects" className="section projects">
      <Title title={title} />
      <div className="section-center projects-center">
        {projects.map((project, index) => {
          // returns for each project a single entry
          return <Project key={project.orderid} index={index} {...project} />;
        })}
      </div>
      {showLink && (
        <Link href="/projects" className="btn center-btn">all projects</Link>
      )}
    </section>
  );
};

export default Projects;