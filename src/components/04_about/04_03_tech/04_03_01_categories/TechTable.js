import React, { useState } from "react";
import {
  HiOutlineChevronDoubleDown,
  HiOutlineChevronDoubleUp,
} from "react-icons/hi";
import SVGImage from "@/components/general/SVGImage";

const TechTable = ({ caption, technologies }) => {
  const [tableCollapsed, setTableCollapsed] = useState(true);

  function collapseTable() {
    setTableCollapsed((tableCollapsed) => !tableCollapsed);
  }

  return (
    <>
      <div className="timeline-flex-header tech-button-wrapper">
        <div
          onClick={collapseTable}
          onKeyDown={collapseTable}
          role="button"
          tabIndex={0}
        >
          {tableCollapsed ? (
            <>
              <HiOutlineChevronDoubleDown className="timeline-flex-collapsible-icon" />
              <span className="flex-heading">{caption}</span>
            </>
          ) : (
            <>
              <HiOutlineChevronDoubleUp className="timeline-flex-collapsible-icon" />
              <span className="flex-heading timeline-flex-title-dark">{caption}</span>
            </>
          )}
        </div>
      </div>

      <div
        className={
          tableCollapsed
            ? "tech-table-grid-wrapper collapsed"
            : "tech-table-grid-wrapper"
        }
      >
        <div className="tech-table-min-height-fix">
          <table className="timeline-legend-table tech-table">
            <tbody className="tablebody">
              <tr>
                <th>Technology</th>
                <th>Experience</th>
              </tr>
              {technologies.map((technology, i) => {
                return (
                  <tr key={i}>
                    <td>
                      <a
                        href={technology.techurl}
                        className="tech-table-anchor"
                      >
                        <SVGImage
                          src={technology.imgurl}
                          alt={technology.skilltitle}
                          width="40px"
                          height="40px"
                        />
                      </a>
                      <br />
                      {technology.skilltitle}
                    </td>
                    <td>{technology.skilldescription}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TechTable;
