import React from "react";
import Layout from "../components/general/Layout";
import Seo from "../components/general/Seo";
import Title from "../components/general/Title";
import Link from "next/link";
import { fetchCookieStaticProps } from "../lib/staticPropsHelpers";
import playgroundTools from "../data/constants/playgroundTools";
import { getIconComponent } from "../utils/iconMap";
import FadeInSection from "../hooks/FadeInSectionClient";

const ToolCard = ({ title, desc, slug, icon, category }) => (
  <FadeInSection>
    <Link href={`/playground/${slug}`} legacyBehavior>
      <a className="blog shadow-box-dark">
        <article className="blog-img-parent">
          <div className="rounded-img-child flex items-center justify-center p-4">
            {getIconComponent(icon, 36, "tile-card-icon")}
          </div>
          <div className="blog-card">
            <h4>{title}</h4>
            <p className="blog-description">{desc}</p>
            <div className="blog-footer-parent">
              <div className="blog-footer">
                <p>{category}</p>
                <p>Tool</p>
              </div>
            </div>
          </div>
        </article>
      </a>
    </Link>
  </FadeInSection>
);

const PlaygroundPage = ({ cookies }) => {
  return (
    <Layout darkFooter={true} cookies={cookies}>
      <Seo
        title="Playground"
        description="Samuel IT - Interactive tools and visualizations built for learning and exploration."
      />
      <section className="blog-page">
        <Title title="The Playground" />
        <div className="section-center blogs-center">
          {playgroundTools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </section>
    </Layout>
  );
};

export async function getStaticProps() {
  const { cookies } = await fetchCookieStaticProps();
  return { props: { cookies } };
}

export default PlaygroundPage;
