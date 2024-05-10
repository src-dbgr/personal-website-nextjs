import React from "react";
import Layout from "../components/general/Layout";
import Hero from "../components/03_hero/Hero";
import About from "../components/04_about/About";
import Experience from "../components/04_about/04_01_experience/Experience";
import Projects from "../components/05_projects/Projects";
import BlogsSection from "../components/06_blog/BlogSection";
import Seo from "../components/general/Seo";
import { gql } from '@apollo/client';
import apolloClient from '../lib/apolloClient';
// import { graphql } from "gatsby";
const index = ({ customData }) => {
  console.log("--------DATA", customData)
  // console.log("--------DATA", blogs)
  const {
    about,
    blogs,
    projects,
    jobs
  } = customData;

  return (
    <Layout darkFooter={true}>
      <Seo title="Home" />
      <Hero />
      <About  infomain={about} />
      <Experience jobs={jobs}/>
      <Projects projects={projects} title="Featured Projects" showLink />
      <BlogsSection blogs={blogs} title="Latest Blog Articles" />
    </Layout>
  );
};

export async function getStaticProps() {
  const { data } = await apolloClient.query({
    query: gql`
      query {
        blogs(sort: "date:desc", pagination: { limit: 3 }) {
          data {
            attributes {
              date
              slug
              desc
              title
              category
              createdAt
              image {
                data {
                  attributes {
                    url
                  }
                }
              }
            }
            id
          }
        }
        projects(filters: { featured: { eq: true } }, sort: "orderid:asc") {
          data {
            attributes {
              title
              description
              image {
                data {
                  attributes {
                    url
                    caption
                    name
                  }
                }
              }
              github
              url
              stack {
                id
                title
              }
              orderid
              createdAt
              updatedAt
              publishedAt
              featured
            }
          }
        }
        about {
          data {
            attributes {
              infomain
            }
          }
        }
        jobs(sort: "id:desc") {
          data {
            attributes {
              company
              short_company
              date
              desc {
                id
                name
              }
              position
            }
            id
          }
        }
      }
    `
  });

  const projects = data.projects.data.map(project => {
    // Erstellt eine tiefe Kopie von attributes
    const attributes = JSON.parse(JSON.stringify(project.attributes));

    // Setzt das image-Objekt auf den Inhalt von attributes.image.data.attributes
    attributes.image = attributes.image.data.attributes;

    return attributes;
  });

  const blogs = data.blogs.data.map(blog => {
    // Erstellt eine tiefe Kopie von attributes
    const attributes = JSON.parse(JSON.stringify(blog.attributes));

    // Setzt das image-Objekt auf den Inhalt von attributes.image.data.attributes
    attributes.image = attributes.image.data.attributes;
    
    return {id: blog.id, ...attributes};
  });

  return {
    props: {
      customData: {
        about: data.about.data.attributes.infomain,
        blogs,
        projects,
        jobs: data.jobs.data.map(e => e.attributes)
      },
    },
    revalidate: 10
  };
}


export default index;
