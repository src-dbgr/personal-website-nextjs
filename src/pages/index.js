import React from "react";
import Layout from "../components/general/Layout";
import Hero from "../components/03_hero/Hero";
import About from "../components/04_about/About";
import Experience from "../components/04_about/04_01_experience/Experience";
import Projects from "../components/05_projects/Projects";
import BlogsSection from "../components/06_blog/BlogSection";
import Seo from "../components/general/Seo";
import { fetchHomePage } from "../lib/strapi";
import { fetchCookieStaticProps } from "../lib/staticPropsHelpers";

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
        description="Senior Software Developer. Production-grade distributed systems, architecture, and security."
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
  const [customData, { cookies }] = await Promise.all([
    fetchHomePage(),
    fetchCookieStaticProps(),
  ]);

  return {
    props: {
      customData,
      cookies,
    },
  };
}

export default index;