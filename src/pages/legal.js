import React from "react";
import Title from "../components/general/Title";
import Layout from "../components/general/Layout";
import Seo from "../components/general/Seo";

const legal  = () => {
  return (
    <Layout darkFooter={true}>
      <Seo title="Legal Notice | Impressum" />
      <section className="legal-page">
        <Title title="Legal Notice / Impressum" />
        <div className="section-center">
          <h1>
            <span className="obf">I</span>
            <span className="obf">m</span>
            <span className="obf">pre</span>
            <span className="obf">ss</span>
            <span className="obf">um</span>
          </h1>
          <h2>Angaben zum Anbieter</h2>
          <div>
            <div className="impressum-name">
              <div className="impressum-name">S&nbsp;a&nbsp;</div>
              <div className="impressum-name">m&nbsp;u&nbsp;</div>
              <div className="impressum-name">e&nbsp;l&nbsp;&nbsp;</div>
              <div className="impressum-name">B&nbsp;l&nbsp;</div>
              <div className="impressum-name">e&nbsp;h&nbsp;m</div>
            </div>
          </div>
          <h3>Postanschrift:</h3>
          <div>
            <div className="impressum-name">
              <div className="impressum-name">Kr</div>
              <div className="impressum-name">ai</div>
              <div className="impressum-name">ch</div>
              <div className="impressum-name">gau</div>
              <div className="impressum-name">st</div>
              <div className="impressum-name">ra</div>
              <div className="impressum-name">ß</div>
              <div className="impressum-name">e&nbsp;3</div>
            </div>
          </div>
          <div>
            <div className="impressum-name">
              <div className="impressum-name">691</div>
              <div className="impressum-name">68&nbsp;</div>
              <div className="impressum-name">Wie</div>
              <div className="impressum-name">s</div>
              <div className="impressum-name">l</div>
              <div className="impressum-name">o</div>
              <div className="impressum-name">ch</div>
            </div>
          </div>
          <h3>Kontakt:</h3>
          <div>
            <span className="obf">E</span>
            <span className="obf">-</span>
            <span className="obf">Mail</span>
            <span className="obf">:&nbsp;</span>
            <div className="impressum-name">
              <div className="impressum-name">m</div>
              <div className="impressum-name">a</div>
              <div className="impressum-name">il</div>
              <div className="impressum-name">@</div>
              <div className="impressum-name">de</div>
              <div className="impressum-name">v</div>
              <div className="impressum-name">sa</div>
              <div className="impressum-name">m</div>
              <div className="impressum-name">.</div>
              <div className="impressum-name">i</div>
              <div className="impressum-name">o</div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 10,
  };
}

export default legal;
