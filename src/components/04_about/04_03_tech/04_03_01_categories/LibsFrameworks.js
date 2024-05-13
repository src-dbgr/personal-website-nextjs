// import React from "react";
// import { graphql, useStaticQuery } from "gatsby";
// import TechTable from "./TechTable";

// const query = graphql`
//   {
//     allStrapiTechstack(
//       filter: {
//         active: { eq: true }
//         categorylabel: { eq: "B_LibsFrameworks" }
//       }
//       sort: { fields: skilllevel, order: DESC }
//     ) {
//       nodes {
//         skilldescription
//         skillleveltag
//         skillcategory
//         imgfilename
//         skilltitle
//         skilllevel
//         skilltype
//         techurl
//         imgurl
//       }
//     }
//   }
// `;

// const LibsFrameworks = () => {
//   const data = useStaticQuery(query);
//   const {
//     allStrapiTechstack: { nodes: libsfames },
//   } = data;
//   return (
//     <TechTable caption="Libraries / Frameworks" technologies={libsfames} />
//   );
// };

// export default LibsFrameworks;
