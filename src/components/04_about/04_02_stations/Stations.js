import React, { useState, useEffect, useRef } from "react";
import { MdWork } from "react-icons/md";
import {
  FaUniversity,
  FaSchool,
  FaPencilRuler,
  FaGraduationCap,
  FaLink,
} from "react-icons/fa";
import {
  HiIdentification,
  HiOutlineChevronDoubleDown,
  HiOutlineChevronDoubleUp,
} from "react-icons/hi";

const Stations = ({ stations, categories }) => {
  const [inViewCount, setInViewCount] = useState(0);
  const [nodes, setNodes] = useState(null);
  const [legendCollapsed, setLegendCollapsed] = useState(true);
  const initialRun = useRef(true);

  useEffect(() => {
    return () => {
      window.removeEventListener("scroll", check);
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function refreshEventListener() {
    window.removeEventListener("scroll", check);
    window.addEventListener("scroll", check);
  }

  function collapseLegend() {
    setLegendCollapsed((legendCollapsed) => !legendCollapsed);
  }

  useEffect(() => {
    if (nodes !== null && inViewCount >= nodes.length) {
      window.removeEventListener("scroll", check);
    }
    return () => { }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inViewCount]);

  // trigger once station nodes are loaded
  useEffect(() => {
    if (initialRun.current) {
      initialRun.current = false;
      return;
    }
    refreshEventListener();
    return () => { }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes]);

  function check() {
    if (nodes !== null) {
      for (var i = 0; i < nodes.length; i++) {
        if (
          isElementInViewport(nodes[i]) &&
          !nodes[i].classList.contains("in-view") &&
          nodes[i].classList.contains("timeline-node")
        ) {
          nodes[i].classList.add("in-view");
          setInViewCount((inViewCount) => inViewCount + 1);
        }
        if (
          isElementInViewport(nodes[i]) &&
          !nodes[i].classList.contains("bullet-in-view") &&
          nodes[i].classList.contains("timeline-bullet-time")
        ) {
          nodes[i].classList.add("bullet-in-view");
          setInViewCount((inViewCount) => inViewCount + 1);
        }
      }
    }
  }

  // check whether the considered element is somewhere visible
  function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
      rect.bottom > 0 &&
      rect.right > 0 &&
      rect.left <
      (window.innerWidth ||
        document.documentElement.clientWidth) /* or $(window).width() */ &&
      rect.top <
      (window.innerHeight ||
        document.documentElement.clientHeight) /* or $(window).height() */
    );
  }

  function collectElements() {
    let found_nodes = document.querySelectorAll(".timeline-node, .timeline-bullet-time");
    setNodes(found_nodes);
  }

  // check whether everything is loaded
  (function ready() {
    // If the body element and the #main element exist
    if (nodes !== null) {
      return;
    } else {
      if (document.querySelectorAll(".timeline-node, .timeline-bullet-time").length > 10) {
        // Return so that we don't call requestAnimationFrame() again
        collectElements();
        return;
      }
    }
    // If the body element isn't found, run ready() again at the next pain
    setTimeout(ready, 200);
  })();

  return (
    <div className="section section-center stations">
      <div
        className={
          legendCollapsed
            ? "timeline-legend-table-wrapper"
            : "timeline-legend-table-wrapper timeline-legend-table-open"
        }
      >
        <div className="timeline-flex-header">
          <div
            onClick={collapseLegend}
            onKeyDown={collapseLegend}
            role="button"
            tabIndex={0}
          >
            {legendCollapsed ? (
              <>
                <HiOutlineChevronDoubleDown className="timeline-flex-collapsible-icon" />
                <h4>Stations Legend</h4>
              </>
            ) : (
              <>
                <HiOutlineChevronDoubleUp className="timeline-flex-collapsible-icon" />
                <h4 className="timeline-flex-title-dark">Stations Legend</h4>
              </>
            )}
          </div>
        </div>
        <table className="timeline-legend-table">
          <tbody className="tablebody">
            <tr>
              <th>Symbol</th>
              <th>Category</th>
              <th>Description</th>
            </tr>
            {categories.map((category, i) => {
              return (
                <tr key={i}>
                  <td>
                    {category.title === "Work" ? (
                      <MdWork />
                    ) : category.title === "School" ? (
                      <FaSchool />
                    ) : category.title === "Internship" ? (
                      <HiIdentification />
                    ) : category.title === "University" ? (
                      <FaUniversity />
                    ) : category.title === "Education" ? (
                      <FaGraduationCap />
                    ) : (
                      <FaPencilRuler />
                    )}
                  </td>
                  <td>{category.title}</td>
                  <td>{category.description}</td>
                  {/* <FaLink className="timeline-link-icon" /> */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <section className="timeline">
        <div className="timeline-heading-wrapper">
          <div className="timeline-heading">
            <time>STATIONS</time>
          </div>
        </div>
        <ul>
          {stations.map((station) => {
            return (
                <li key={station.Order_Id}>
                  <div className="timeline-node shadow-box">
                    <div className="timeline-meta-head">
                      <div>
                        {station.stationctgry.title === "Work" ? (
                          <MdWork />
                        ) : station.stationctgry.title === "School" ? (
                          <FaSchool />
                        ) : station.stationctgry.title === "Internship" ? (
                          <HiIdentification />
                        ) : station.stationctgry.title === "University" ? (
                          <FaUniversity />
                        ) : station.stationctgry.title === "Education" ? (
                          <FaGraduationCap />
                        ) : (
                          <FaPencilRuler />
                        )}
                        <div className="timeline-from-to-category">
                          <div className="timeline-width">
                            <h4>Category:</h4>
                          </div>
                          <div className="timeline-div-text">
                            {station.stationctgry.title}
                          </div>
                        </div>
                        <div className="timeline-from-to">
                          <div className="timeline-from-to">
                            <div className="timeline-width">
                              <h4>Institution:</h4>
                            </div>
                            <div>{station.Institution}</div>
                          </div>
                        </div>
                        <div className="timeline-from-to">
                          <div className="timeline-from-to">
                            <div className="timeline-width">
                              <h4>From:</h4>
                            </div>
                            <div>
                              {station.From_Month}/{station.From_Year}
                            </div>
                          </div>
                          <div className="timeline-from-to">
                            <div className="timeline-width-two">
                              <h4>To:</h4>
                            </div>
                            <div>
                              {station.To_Text !== null
                                ? station.To_Text
                                : station.To_Month + "/" + station.To_Year}
                            </div>
                          </div>
                        </div>
                        {station.Graduation != null && (
                          <div className="timeline-from-to">
                            <div className="timeline-from-to">
                              <div className="timeline-width">
                                <h4>Graduation:</h4>
                              </div>
                              <div>{station.Graduation}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <p>{station.Description}</p>
                    {station.urls.length > 0 && (
                      <div className="timeline-from-to timeline-resources">
                        <div className="timeline-links">
                          <h4>Resources / Certificates:</h4>
                          {station.urls.map((url) => {
                            return (
                              <table key={url.id}>
                                <tbody>
                                  <tr className="timeline-link-element">
                                    <td>
                                      <FaLink className="timeline-link-icon" />
                                    </td>
                                    <td>
                                      <a href={url.url}>{url.title}</a>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    <div className="about-stack">
                      {station.stack.map((item) => {
                        return <span key={item.id}>{item.title}</span>;
                      })}
                    </div>
                  </div>
                  <p className="timeline-bullet-time">
                    {station.From_Year}
                  </p>
                </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};

export default Stations;
