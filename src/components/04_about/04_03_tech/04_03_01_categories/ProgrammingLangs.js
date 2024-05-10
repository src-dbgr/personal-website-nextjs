import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import TechTable from "./TechTable";

const query = graphql`
  {
    allStrapiTechstack(
      filter: {
        active: { eq: true }
        categorylabel: { eq: "A_ProgrammingLangs" }
      }
      sort: { fields: skilllevel, order: DESC }
    ) {
      nodes {
        skilldescription
        skillleveltag
        skillcategory
        imgfilename
        skilltitle
        skilllevel
        skilltype
        techurl
        imgurl
      }
    }
  }
`;

const ProgrammingLangs = () => {
  const data = useStaticQuery(query);
  const {
    allStrapiTechstack: { nodes: proglangs },
  } = data;
  return <TechTable caption="Programming Languages" technologies={proglangs} />;
};

export default ProgrammingLangs;
