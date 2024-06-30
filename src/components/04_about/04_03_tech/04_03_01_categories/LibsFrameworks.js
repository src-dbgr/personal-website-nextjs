// components/04_about/04_03_tech/04_03_01_categories/LibsFrameworks.js

import React from "react";
import TechTable from "./TechTable";

const LibsFrameworks = ({ techstacks }) => {
  return <TechTable caption="Libraries / Frameworks" technologies={techstacks} />;
};

export default LibsFrameworks;
