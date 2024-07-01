// components/04_about/04_03_tech/04_03_01_categories/DataDesign.js

import React from "react";
import TechTable from "./TechTable";

const DataDesign = ({ techstacks }) => {
  return <TechTable caption="Data / Design" technologies={techstacks} />;
};

export default DataDesign;
