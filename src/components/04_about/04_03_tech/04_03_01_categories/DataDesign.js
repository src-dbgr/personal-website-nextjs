import React from "react";
import TechTable from "./TechTable";
import { gql, useQuery } from '@apollo/client';

const TECHSTACK_DATA_DESIGN_QUERY = gql`
  query Techstacks {
    techstacks(
      filters: {
        active: { eq: true }
        categorylabel: { eq: "D_DataDesign" }
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

const DataDesign = () => {
  const { data, loading, error } = useQuery(TECHSTACK_DATA_DESIGN_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const datades = data.techstacks.data.map(item => item.attributes);

  return <TechTable caption="Data / Design" technologies={datades} />;
};

export default DataDesign;
