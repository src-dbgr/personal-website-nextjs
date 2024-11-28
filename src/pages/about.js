import React, { useState } from "react";
import Image from 'next/image';
import Layout from "../components/general/Layout";
import Title from "../components/general/Title";
import { BsCircleFill } from "react-icons/bs";
import { IoTriangleSharp } from "react-icons/io5";
import { MdFileDownload } from "react-icons/md";
import Technologies from "../components/04_about/04_03_tech/Technologies";
import Stations from "../components/04_about/04_02_stations/Stations";
import FadeInSection from "../hooks/FadeInSection";
import Seo from "../components/general/Seo";
import { gql } from '@apollo/client';
import apolloClient from '../lib/apolloClient';
import { fetchCookieStaticProps } from '../lib/staticPropsHelpers';

const AboutPage = ({ customData, cookies }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const { about, stations, categories, techstacks } = customData;

  return (
    <Layout darkFooter={false} cookies={cookies}>
      <Seo title="About" description={""} />
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
                <Image src={about.image.url} width={500} height={427} className="about-default-img" alt={about.title} />
              </div>
            </article>
          </FadeInSection>
        </div>
        <FadeInSection>
          <div id="resume" className="about-download">
            <div className="resume-wrapper">
              <a href="/resume_sb.pdf" className="btn center-btn">
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
  const { data } = await apolloClient.query({
    query: gql`
      query {
        about {
          title
          stack {
            id
            title
          }
          info
          image {
            url
          }
        }
        stations(pagination: {pageSize: 1000}, sort: "Order_Id:desc", filters: { Activated: { eq: true } }) {
          Date
          Description
          From_Month
          From_Year
          Order_Id
          To_Month
          To_Year
          To_Text
          Graduation
          Institution
          stack {
            id
            title
          }
          urls {
            id
            title
            url
          }
          stationctgry {
            title
            description
            icon {
              url
              mime
            }
          }
        }
        stationctgries {
          title
          description
          icon {
            mime
            url
          }
        }
        techstacks(pagination: {pageSize: 1000}, filters: { active: { eq: true } }, sort: "skilllevel:desc") {
          skilldescription
          skillleveltag
          skillcategory
          imgfilename
          skilltitle
          skilllevel
          skilltype
          techurl
          imgurl
          categorylabel
        }
      }
    `
  });

  const about = {
    ...data.about,
    image: { url: data.about.image.url }
  };

  const stations = data.stations.map((station) => ({
    ...station,
    stationctgry: station.stationctgry
  }));

  const categories = data.stationctgries.map((category) => ({
    ...category,
    icon: category.icon
  }));

  const techstacks = data.techstacks;

  const { cookies } = await fetchCookieStaticProps();

  return {
    props: {
      customData: {
        about,
        stations,
        categories,
        techstacks,
      },
      cookies,
    },
    revalidate: 10,
  };
}

export default AboutPage;
