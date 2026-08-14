// components/04_about/04_03_tech/Technologies.js

import React from "react";
import ProgrammingLangs from "./04_03_01_categories/ProgrammingLangs";
import LibsFrameworks from "./04_03_01_categories/LibsFrameworks";
import ToolsPlatforms from "./04_03_01_categories/ToolsPlatforms";
import DataDesign from "./04_03_01_categories/DataDesign";

const PROGRAMMING_ORDER = [
  "Java",
  "TypeScript",
  "JavaScript",
  "SQL",
  "Go",
  "Python",
  "HTML",
  "CSS",
];

const LIBS_ORDER = [
  "Spring Boot",
  "Angular",
  "React",
  "Mockito",
  "Kubernetes",
];

const TOOLS_ORDER = [
  "Apache Kafka",
  "OpenShift",
  "MongoDB",
  "Git / GitHub",
  "Docker",
  "Maven",
  "Linux",
  "Grafana",
  "Helm",
  "Terraform",
  "Jenkins",
  "Solace PubSub+",
  "AWS",
  "RabbitMQ",
];

const DATA_ORDER = ["Strapi"];

function byTitleOrder(items, order) {
  const rank = new Map(order.map((title, index) => [title, index]));
  return [...items].sort((a, b) => {
    const left = rank.has(a.skilltitle) ? rank.get(a.skilltitle) : order.length;
    const right = rank.has(b.skilltitle) ? rank.get(b.skilltitle) : order.length;
    if (left !== right) {
      return left - right;
    }
    return a.skilltitle.localeCompare(b.skilltitle);
  });
}

const Technologies = ({ techstacks }) => {
  const programmingLangs = byTitleOrder(
    techstacks.filter((stack) => stack.categorylabel === "A_ProgrammingLangs"),
    PROGRAMMING_ORDER
  );
  const libsFrameworks = byTitleOrder(
    techstacks.filter((stack) => stack.categorylabel === "B_LibsFrameworks"),
    LIBS_ORDER
  );
  const toolsPlatforms = byTitleOrder(
    techstacks.filter((stack) => stack.categorylabel === "C_ToolsPlatforms"),
    TOOLS_ORDER
  );
  const dataDesign = byTitleOrder(
    techstacks.filter((stack) => stack.categorylabel === "D_DataDesign"),
    DATA_ORDER
  );

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
