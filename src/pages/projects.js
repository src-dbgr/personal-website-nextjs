// pages/projects.js
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
      data {
        attributes {
          github
          orderid
          description
          title
          url
          image {
            data {
              attributes {
                url
              }
            }
          }
          stack {
            id
            title
          }
        }
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
  const { data: projectsData } = await apolloClient.query({
    query: GET_PROJECTS,
  });

  const projects = projectsData.projects.data.map(project => ({
    ...project.attributes,
    image: project.attributes.image.data.attributes,
  }));

  const { cookies } = await fetchCookieStaticProps();

  return {
    props: {
      projects,
      cookies,
    },
    revalidate: 10, // Optional: Setzt die Revalidierungszeit für die statische Seite
  };
}

export default ProjectsPage;
