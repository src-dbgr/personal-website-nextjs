import React from 'react';
import { gql, useQuery } from '@apollo/client';
import Layout from '../components/general/Layout';
import Projects from '../components/05_projects/Projects';
import Seo from '../components/general/Seo';
import Image from 'next/image';

const GET_PROJECTS = gql`
    query Techstacks {
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

const ProjectsPage = () => {
  const { loading, error, data } = useQuery(GET_PROJECTS, {
    variables: { sort: 'orderid:asc' },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const projects = data.projects.data.map(project => ({
    ...project.attributes,
  }));

  return (
    <Layout darkFooter={false}>
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

export default ProjectsPage;
