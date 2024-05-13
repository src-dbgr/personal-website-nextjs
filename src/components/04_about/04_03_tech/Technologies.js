import React from "react";
// import ProgrammingLangs from "./04_03_01_categories/ProgrammingLangs";
// import LibsFrameworks from "./04_03_01_categories/LibsFrameworks";
import ToolsPlatforms from "./04_03_01_categories/ToolsPlatforms";
// import DataDesign from "./04_03_01_categories/DataDesign";

const Technologies = () => {
  return (
    <div className="section section-center tech-table-comp">
      <div className="timeline-legend-table-wrapper tech-table-open">
        <div className="timeline-flex-header tech-caption">
          <h4>Technology Experience</h4>
        </div>
        {/* <ProgrammingLangs /> */}
        {/* <LibsFrameworks /> */}
        <ToolsPlatforms />
        {/* <DataDesign /> */}
      </div>
    </div>
  );
};

export default Technologies;
