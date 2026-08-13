import React from 'react';
import { gql } from '@apollo/client';
import apolloClient from '../lib/apolloClient';
import Layout from '../components/general/Layout';
import Projects from '../components/05_projects/Projects';
import Seo from '../components/general/Seo';
import { fetchCookieStaticProps } from '../lib/staticPropsHelpers';

const GET_PROJECTS = gql`
  query GetProjects {
    projects(sort: ["orderid:asc"]) {
      github
      orderid
      description
      title
      documentId
      url
      image {
        url
        caption
        name
      }
      stack {
        id
        title
      }
    }
  }
`;

const ProjectsPage = ({ projects, cookies }) => {
  return (
    <Layout darkFooter={false} cookies={cookies}>
      <Seo
        title="Projects"
        description="Samuel IT - Discover the latest IT projects I worked on."
      />
      <section className="projects-page">
        <Projects projects={projects} title="all projects" />
      </section>
    </Layout>
  );
};

export async function getStaticProps() {
  const [{ data }, { cookies }] = await Promise.all([
    apolloClient.query({
      query: GET_PROJECTS,
    }),
    fetchCookieStaticProps(),
  ]);

  const projects = data.projects;

  return {
    props: {
      projects,
      cookies,
    }
  };
}

export default ProjectsPage;