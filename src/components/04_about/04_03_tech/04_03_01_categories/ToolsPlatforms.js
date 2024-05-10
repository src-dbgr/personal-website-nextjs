import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import TechTable from "./TechTable";

const query = graphql`
  {
    allStrapiTechstack(
      filter: {
        active: { eq: true }
        categorylabel: { eq: "C_ToolsPlatforms" }
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

const ToolsPlatforms = () => {
  const data = useStaticQuery(query);
  const {
    allStrapiTechstack: { nodes: toolsplats },
  } = data;
  return (
    <TechTable
      caption="
    Tools / Platforms"
      technologies={toolsplats}
    />
  );
};

export default ToolsPlatforms;
