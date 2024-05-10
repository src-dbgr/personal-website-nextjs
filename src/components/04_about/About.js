import React from "react";
import Title from "../general/Title";
import Image from "next/image";
import { BsCircleFill } from "react-icons/bs";
import { IoTriangleSharp } from "react-icons/io5";
import FadeInSection from "../../hooks/FadeInSection";

const About = ({ infomain }) => {
  return (
    <section id="about" className="section about-component-section">
      <Title title="Welcome" />
      <div className="section-center about-component-center">
        <FadeInSection>
          <article key="1" className="about-component shadow-box">
            <div className="ball-icon-wrapper">
              <BsCircleFill
                id="bs-circle-fill"
                className="about-component-icon"
              />
              <IoTriangleSharp
                id="io-triangle-sharp"
                className="about-component-icon"
              />
            </div>
            <h4>Who am I?</h4>
            <div className="underline"></div>
            <p>{infomain}</p>
            <ul className="skill-set">
              <li>Python</li>
              <li>Java</li>
              <li>K8s</li>
              <li>TensorFlow</li>
              <li>JS</li>
              <li>Go</li>
            </ul>
          </article>
        </FadeInSection>
        <FadeInSection>
          <article key="2" className="about-component about-img-container">
            <div className="about-img">
              <Image
                src="/assets/images/about/var_5.png"
                alt="about-img"
                className="about-default-img"
                blurDataURL="/assets/images/about/var_5.png"
                quality={90}
                layout="fixed"
                width={470}
                height={450}
              />
              <Image
                src='/assets/images/about/var_1.png'
                alt="about-img"
                className="about-hover-img"
                quality={90}
                layout="fixed"
                width={470}
                height={450}
              />
            </div>
          </article>
        </FadeInSection>
      </div>
    </section>
  );
};

export default About;
