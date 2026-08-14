import React, { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import Layout from "../components/general/Layout";
import Title from "../components/general/Title";
import { BsCircleFill } from "react-icons/bs";
import { IoTriangleSharp } from "react-icons/io5";
import { MdFileDownload } from "react-icons/md";
import Seo from "../components/general/Seo";
import { fetchAboutPage } from "../lib/strapi";
import { fetchCookieStaticProps } from "../lib/staticPropsHelpers";
import FadeInSection from "../hooks/FadeInSectionClient";

const Technologies = dynamic(
  () => import("../components/04_about/04_03_tech/Technologies"),
  {
    loading: () => <div>Loading...</div>,
  }
);
const Stations = dynamic(
  () => import("../components/04_about/04_02_stations/Stations"),
  {
    loading: () => <div>Loading...</div>,
  }
);

const AboutPage = ({ customData, cookies }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const { about, stations, categories, techstacks } = customData;

  return (
    <Layout darkFooter={false} cookies={cookies}>
      <Seo
        title="About"
        description="Senior Software Developer. Production distributed systems, architecture, and security."
      />
      <section className="about-page">
        <Title title={about.title} />
        <div className={`section section-center about-component-center ${isExpanded ? '' : 'h-500'}`}>
          <FadeInSection>
            <article key="1" className="about-component shadow-box">
              <div className="ball-icon-wrapper">
                <BsCircleFill id="bs-circle-fill" className="about-component-icon" />
                <IoTriangleSharp id="io-triangle-sharp" className="about-component-icon" />
              </div>
              <h4>Who am I?</h4>
              <div className="underline"></div>
              <div className={`about-text ${isExpanded ? 'expanded' : 'colappsed'}`}>
                <p>{about.info}</p>
              </div>
              <button className="about-btn-toggle" onClick={toggleExpand}>
                {isExpanded ? 'SHOW LESS' : 'SHOW MORE'}
              </button>
              <div className="about-stack">
                {about.stack.map((item) => (
                  <span key={item.id}>{item.title}</span>
                ))}
              </div>
            </article>
          </FadeInSection>
          <FadeInSection>
            <article key="2" className="about-component about-img-container">
              <div className="about-img" id="paimg">
                <Image
                  src="/assets/images/about/var_6.png"
                  alt="about-img"
                  className="about-default-img"
                  blurDataURL="/assets/images/about/var_6.png"                  quality={90}
                  placeholder="blur"
                  priority
                  width={500}
                  height={427}
                />
              </div>
            </article>
          </FadeInSection>
        </div>
        <FadeInSection>
          <div id="resume" className="about-download">
            <div className="resume-wrapper">
              <a
                href="/samuel-blehm-resume-en.pdf"
                download="samuel-blehm-resume-en.pdf"
                className="btn center-btn"
              >
                <span className="btn">
                  <MdFileDownload className="icon-margin" />
                  RÉSUMÉ
                </span>
              </a>
            </div>
          </div>
        </FadeInSection>
        <FadeInSection>
          <Technologies techstacks={techstacks} />
        </FadeInSection>
        <FadeInSection>
          <Stations stations={stations} categories={categories} />
        </FadeInSection>
      </section>
    </Layout>
  );
};

export async function getStaticProps() {
  const [customData, { cookies }] = await Promise.all([
    fetchAboutPage(),
    fetchCookieStaticProps(),
  ]);

  return {
    props: {
      customData,
      cookies,
    },
  };
}

export default AboutPage;
