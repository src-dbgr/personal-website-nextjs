import React from "react";
import Layout from "../components/general/Layout";
import Projects from "../components/05_projects/Projects";
import Seo from "../components/general/Seo";
import { fetchProjects } from "../lib/strapi";
import { fetchCookieStaticProps } from "../lib/staticPropsHelpers";

const ProjectsPage = ({ projects, cookies }) => {
  return (
    <Layout darkFooter={false} cookies={cookies}>
      <Seo
        title="Projects"
        description="Samuel IT - Production and personal IT projects."
      />
      <section className="projects-page">
        <Projects projects={projects} title="all projects" />
      </section>
    </Layout>
  );
};

export async function getStaticProps() {
  const [projects, { cookies }] = await Promise.all([
    fetchProjects(),
    fetchCookieStaticProps(),
  ]);

  return {
    props: {
      projects,
      cookies,
    },
  };
}

export default ProjectsPage;