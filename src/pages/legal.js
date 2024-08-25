import React from "react";
import Title from "../components/general/Title";
import Layout from "../components/general/Layout";
import Seo from "../components/general/Seo";
import { fetchCookieStaticProps } from '../lib/staticPropsHelpers';

const legal  = ({ cookies }) => { // cookies als Prop hinzufügen
  return (
    <Layout darkFooter={true} cookies={cookies}>
      <Seo title="Legal Notice | Impressum" />
      <section className="legal-page">
        <Title title="Legal Notice / Impressum" />
        <div className="section-center">
          <h1>Impressum</h1>
          <h2>Angaben gemäß § 5 TMG:</h2>
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
            <div className="impressum-name">
              <p>Telefon:&nbsp;</p>
              <div className="impressum-name">+4</div>
              <div className="impressum-name">9</div>
              <div className="impressum-name">&nbsp;</div>
              <div className="impressum-name">15&nbsp;</div>
              <div className="impressum-name">170</div>
              <div className="impressum-name">87</div>
              <div className="impressum-name">66</div>
              <div className="impressum-name">04</div>
            </div>
            <div className="impressum-name">
              <p>E-Mail:&nbsp;</p>
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
            <br />
          </p>
          <p></p>
          <h2>Hinweise zur Website</h2>
          <p></p>
          <h2>Information gemäß § 36 VSBG</h2>
          <p>
            Gemäß § 36 VSBG (Verbraucherstreitbeilegungsgesetz – Gesetz über die
            alternative Streitbeilegung in Verbrauchersachen) erklärt der
            Betreiber dieser Website:
          </p>
          <p>
            Wir sind weder bereit noch verpflichtet, an
            Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
            teilzunehmen.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export async function getStaticProps() {
  const { cookies } = await fetchCookieStaticProps(); // Cookies Daten abfragen

  return {
    props: {
      cookies,
    },
    revalidate: 10, // Optional: Setzt die Revalidierungszeit für die statische Seite
  };
}

export default legal;
