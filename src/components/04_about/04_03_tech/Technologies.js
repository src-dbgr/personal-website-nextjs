// components/04_about/04_03_tech/Technologies.js

import React from "react";
import ProgrammingLangs from "./04_03_01_categories/ProgrammingLangs";
import LibsFrameworks from "./04_03_01_categories/LibsFrameworks";
import ToolsPlatforms from "./04_03_01_categories/ToolsPlatforms";
import DataDesign from "./04_03_01_categories/DataDesign";

const Technologies = ({ techstacks }) => {
  const programmingLangs = techstacks.filter(stack => stack.categorylabel === "A_ProgrammingLangs");
  const libsFrameworks = techstacks.filter(stack => stack.categorylabel === "B_LibsFrameworks");
  const toolsPlatforms = techstacks.filter(stack => stack.categorylabel === "C_ToolsPlatforms");
  const dataDesign = techstacks.filter(stack => stack.categorylabel === "D_DataDesign");

  return (
    <div className="section section-center tech-table-comp">
      <div className="timeline-legend-table-wrapper tech-table-open">
        <div className="timeline-flex-header tech-caption">
          <h4>Technology Experience</h4>
        </div>
        <ProgrammingLangs techstacks={programmingLangs} />
        <LibsFrameworks techstacks={libsFrameworks} />
        <ToolsPlatforms techstacks={toolsPlatforms} />
        <DataDesign techstacks={dataDesign} />
      </div>
    </div>
  );
};

export default Technologies;
