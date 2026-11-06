import React from "react";
import Title from "../components/general/Title";
import Layout from "../components/general/Layout";
import Seo from "../components/general/Seo";

const legal  = () => {
  return (
    <Layout darkFooter={true}>
      <Seo title="Legal Notice" />
      <section className="legal-page">
        <Title title="Legal Notice" />
        <div className="section-center">
          <h1>
            <span className="obf">Le</span>
            <span className="obf">g</span>
            <span className="obf">al&nbsp;</span>
            <span className="obf">No</span>
            <span className="obf">ti</span>
            <span className="obf">ce</span>
          </h1>
          <h2>Provider</h2>
          <div>
            <div className="impressum-name">
              <div className="impressum-name">S&nbsp;a&nbsp;</div>
              <div className="impressum-name">m&nbsp;u&nbsp;</div>
              <div className="impressum-name">e&nbsp;l&nbsp;&nbsp;</div>
              <div className="impressum-name">B&nbsp;l&nbsp;</div>
              <div className="impressum-name">e&nbsp;h&nbsp;m</div>
            </div>
          </div>
          <h3>Contact:</h3>
          <div>
            <span className="obf">E</span>
            <span className="obf">ma</span>
            <span className="obf">il</span>
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
          <p>
            <span className="obf">A po</span>
            <span className="obf">st</span>
            <span className="obf">al ad</span>
            <span className="obf">dr</span>
            <span className="obf">ess is av</span>
            <span className="obf">ail</span>
            <span className="obf">able on re</span>
            <span className="obf">qu</span>
            <span className="obf">est by em</span>
            <span className="obf">ail.</span>
          </p>
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
