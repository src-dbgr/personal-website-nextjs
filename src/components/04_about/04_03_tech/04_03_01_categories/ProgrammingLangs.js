import React from "react";
import TechTable from "./TechTable";
import { gql, useQuery } from '@apollo/client';

const TECHSTACK_PROG_LANGS_QUERY = gql`
  query Techstacks {
    techstacks(
      filters: {
        active: { eq: true }
        categorylabel: { eq: "A_ProgrammingLangs" }
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

const ProgrammingLangs = () => {
  const { data, loading, error } = useQuery(TECHSTACK_PROG_LANGS_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const proglangs = data.techstacks.data.map(item => item.attributes);

  return <TechTable caption="Programming Languages" technologies={proglangs} />;
};

export default ProgrammingLangs;