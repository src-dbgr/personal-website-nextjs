// components/04_about/04_03_tech/ToolsPlatforms.js

import React from "react";
import TechTable from "./TechTable";
import { gql } from '@apollo/client';
import apolloClient from '../../../../lib/apolloClient';

const GET_TOOLS_PLATFORMS = gql`
  query {
    techstacks(filters: { active: { eq: true }, categorylabel: { eq: "C_ToolsPlatforms" } }) {
      data {
        attributes {
          skilldescription
          skillleveltag
          skillcategory
          imgfilename
          skilltype
          skilllevel
          skilltitle
          techurl
          imgurl
        }
      }
    }
  }
`;

const ToolsPlatforms = ({ toolsplats }) => {
  return (
    <TechTable
      caption="Tools / Platforms"
      technologies={toolsplats}
    />
  );
};

export async function getStaticProps() {
  const { data } = await apolloClient.query({
    query: GET_TOOLS_PLATFORMS
  });

  const toolsplats = data.techstacks.data.map(node => node.attributes);

  return {
    props: {
      toolsplats
    },
    revalidate: 10 // optional, to enable ISR
  };
}

export default ToolsPlatforms;
