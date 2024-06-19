// components/04_about/04_03_tech/ToolsPlatforms.js

import React from "react";
import TechTable from "./TechTable";
import { gql, useQuery } from '@apollo/client';

const TECHSTACK_TOOLS_PLATFORM_QUERY = gql`
  query Techstacks {
    techstacks(
      filters: {
        active: { eq: true }
        categorylabel: { eq: "C_ToolsPlatforms" }
      }
      sort: "skilllevel:desc"
    ) {
      data {
        attributes {
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
  }
`;

const ToolsPlatforms = () => {
  const { data, loading, error } = useQuery(TECHSTACK_TOOLS_PLATFORM_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const toolsplats = data.techstacks.data.map(item => item.attributes);

  return (
    <TechTable
      caption="Tools / Platforms"
      technologies={toolsplats}
    />
  );
};

export default ToolsPlatforms;
