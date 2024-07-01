// components/04_about/04_03_tech/04_03_01_categories/ProgrammingLangs.js

import React from "react";
import TechTable from "./TechTable";

const ProgrammingLangs = ({ techstacks }) => {
  return <TechTable caption="Programming Languages" technologies={techstacks} />;
};

export default ProgrammingLangs;
