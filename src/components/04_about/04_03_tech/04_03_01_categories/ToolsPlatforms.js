// components/04_about/04_03_tech/04_03_01_categories/ToolsPlatforms.js

import React from "react";
import TechTable from "./TechTable";

const ToolsPlatforms = ({ techstacks }) => {
  return <TechTable caption="Tools / Platforms" technologies={techstacks} />;
};

export default ToolsPlatforms;
