// src/pages/playground.js
import React from "react";
import Layout from "../components/general/Layout";
import Seo from "../components/general/Seo";
import Title from "../components/general/Title";
import Link from "next/link";
import dynamic from "next/dynamic";
import { fetchCookieStaticProps } from "../lib/staticPropsHelpers";
import playgroundTools from "../data/constants/playgroundTools"; // Importiere deine Tool-Daten
import { getIconComponent } from "../utils/iconMap";

const FadeInSection = dynamic(() => import("../hooks/FadeInSection"), {
  ssr: false,
  loading: () => <div>Loading ...</div>,
});

// Neue Komponente für die Darstellung eines einzelnen Tools (ähnlich Blog.js)
const ToolCard = ({ title, desc, slug, icon, category }) => (
  <FadeInSection>
    <Link href={`/playground/${slug}`} legacyBehavior>
      <a className="blog shadow-box-dark">
        <article className="blog-img-parent">
          {/* HIER ANPASSEN: Die Klasse, die das Bild des Blogs stylt,
             muss so angepasst werden, dass sie nur das Icon zentriert
             und nicht auf ein Bild-Asset wartet. Wir belassen den
             CSS-Struktur, ändern nur den Inhalt/das Icon-Styling. */}
          <div className="rounded-img-child flex items-center justify-center p-4">
            {getIconComponent(icon, 36, "text-emerald-400")}
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
          {" "}
          {/* Nutze dieselbe Klasse wie Blog-Liste */}
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
