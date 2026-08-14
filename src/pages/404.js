import React from "react";
import Layout from "../components/general/Layout";
import Title from "../components/general/Title";
import Seo from "../components/general/Seo";
import Link from "next/link";
import { fetchCookieStaticProps } from "../lib/staticPropsHelpers";
import NotFoundIllustration from "../components/general/NotFoundIllustration";

const Error = ({ cookies }) => {
  return (
    <Layout darkFooter={true} cookies={cookies}>
      <Seo
        title="404"
        description="The requested content could not be found. Check if the entered URL is correct."
      />
      <section className="section error-section">
        <div className="error-page">
          <Title title="PAGE NOT FOUND" />
          <NotFoundIllustration />
          <Link href="/" className="btn center-btn">
            <span className="btn">back home</span>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export async function getStaticProps() {
  const { cookies } = await fetchCookieStaticProps();

  return {
    props: {
      cookies,
    },
    revalidate: 10,
  };
}

export default Error;
