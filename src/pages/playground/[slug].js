import React from "react";
import Layout from "../../components/general/Layout";
import Seo from "../../components/general/Seo";
import Title from "../../components/general/Title";
import Link from "next/link";
import dynamic from "next/dynamic";
import { fetchCookieStaticProps } from "../../lib/staticPropsHelpers";
import playgroundTools from "../../data/constants/playgroundTools";
import FadeInSection from "../../hooks/FadeInSectionClient";

const BackpropVisualizer = dynamic(
  () => import("../../components/Playground/BackpropVisualizer"),
  {
    ssr: false,
    loading: () => (
      <div className="text-center p-10">Loading Interactive Tool...</div>
    ),
  }
);

const ToolTemplate = ({ tool, cookies }) => {
  if (!tool) {
    return (
      <Layout darkFooter={false} cookies={cookies}>
        <Seo title="Tool not Found" />
        <div className="text-center p-10">
          Tool not found. <Link href="/playground">Go to Playground</Link>
        </div>
      </Layout>
    );
  }

  const ToolComponent =
    tool.slug === "backpropagation"
      ? BackpropVisualizer
      : () => (
          <div>Tool Component for {tool.title} is not yet implemented.</div>
        );

  return (
    <Layout darkFooter={true} cookies={cookies}>
      <Seo title={tool.title} description={tool.desc} />
      <section className="backprop-template blog-template">
        <Title title={tool.title} />
        <FadeInSection>
          {/* No blog-content: article reading styles would break Backprop centering. */}
          <div className="section-center wide-container">
            <div className="tool-content-wrapper">
              <ToolComponent />
              <Link href="/playground" legacyBehavior>
                <a className="btn center-btn">
                  <span>All Playground Tools</span>
                </a>
              </Link>
            </div>
          </div>
        </FadeInSection>
      </section>
    </Layout>
  );
};

export async function getStaticPaths() {
  const paths = playgroundTools.map((tool) => ({
    params: { slug: tool.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const tool = playgroundTools.find((t) => t.slug === params.slug) || null;
  const { cookies } = await fetchCookieStaticProps();

  return {
    props: { tool, cookies },
  };
}

export default ToolTemplate;
