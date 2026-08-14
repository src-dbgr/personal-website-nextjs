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
import { fetchCookieStaticProps } from '../lib/staticPropsHelpers';

const index = ({ customData, cookies }) => {
  const {
    about,
    aboutStack,
    blogs,
    projects,
    jobs
  } = customData;

  return (
    <Layout darkFooter={true} cookies={cookies}>
      <Seo
        title="Home"
        description="Senior Software Developer. Distributed systems, architecture, reliability, and security in the delivery path."
      />
      <Hero />
      <About infomain={about} stack={aboutStack} />
      <Experience jobs={jobs}/>
      <Projects projects={projects} title="Featured Projects" showLink />
      <BlogsSection blogs={blogs} title="Latest Blog Articles" showLink />
    </Layout>
  );
};

export async function getStaticProps() {
  const [{ data }, { cookies }] = await Promise.all([
    apolloClient.query({
      query: gql`
        query {
          blogs(sort: "date:desc", pagination: { limit: 3 }) {
            date
            slug
            desc
            title
            category
            createdAt
            image {
              url
            }
            documentId
          }
          projects(filters: { featured: { eq: true } }, sort: "orderid:asc") {
            title
            description
            image {
              url
            }
            github
            url
            stack {
              id
              title
            }
            orderid
          }
          about {
            documentId
            infomain
            stack {
              id
              title
            }
          }
          jobs(sort: "id:desc") {
            company
            short_company
            date
            desc {
              id
              name
            }
            position
            documentId
          }
        }
      `,
    }),
    fetchCookieStaticProps(),
  ]);

  const projects = data.projects;
  
  const blogs = data.blogs.map(blog => ({
    id: blog.documentId,
    ...blog
  }));

  return {
    props: {
      customData: {
        about: data.about.infomain,
        aboutStack: data.about.stack,
        blogs,
        projects,
        jobs: data.jobs
      },
      cookies,
    }
  };
}

export default index;