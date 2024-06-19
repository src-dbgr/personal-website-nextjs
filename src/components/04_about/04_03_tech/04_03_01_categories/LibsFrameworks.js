import React from "react";
import TechTable from "./TechTable";
import { gql, useQuery } from '@apollo/client';

const TECHSTACK_LIB_QUERY = gql`
  query Techstacks {
    techstacks(
      filters: {
        active: { eq: true }
        categorylabel: { eq: "B_LibsFrameworks" }
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

const LibsFrameworks = () => {
  const { data, loading, error } = useQuery(TECHSTACK_LIB_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const libsfames = data.techstacks.data.map(item => item.attributes);

  return (
    <TechTable caption="Libraries / Frameworks" technologies={libsfames} />
  );
};

export default LibsFrameworks;