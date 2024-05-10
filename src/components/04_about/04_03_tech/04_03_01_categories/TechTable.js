import React, { useState, useEffect, useRef } from "react";
import {
  HiOutlineChevronDoubleDown,
  HiOutlineChevronDoubleUp,
} from "react-icons/hi";

const TechTable = ({ caption, technologies }) => {
  const [tableCollapsed, setTableCollapsed] = useState(true);
  const initialRun = useRef(true);

  function collapseTable() {
    setTableCollapsed((tableCollapsed) => !tableCollapsed);
  }

  function skillBarAnim() {
    document.querySelectorAll(".skills-wrapper svg").forEach((item, i) => {
      let smallC = Array.from(item.parentElement.children).filter(
        (child) => child.tagName === "SMALL"
      );
      if (smallC[0].innerText === "") {
        setTimeout(() => {
          animate(smallC[0], 0, percent, 500);
        }, 150);
      } else {
        return;
      }
      let circle = Array.from(item.children).filter(function (child) {
        return child.classList.contains("cbar");
      });
      let r = circle[0].getAttribute("r");
      let c = Math.PI * (r * 2);
      let percent = circle[0].parentElement.parentElement.dataset.percent;

      let cbar = ((100 - percent) / 100) * c;
      circle[0].style.strokeDashoffset = c;
      circle[0].style.strokeDasharray = c;
      setTimeout(() => {
        circle[0].animate(
          [
            // keyframes
            { strokeDashoffset: cbar },
          ],
          {
            // timing options
            duration: 500,
            easing: "linear",
            fill: "forwards",
          }
        );
      }, 150);
    });
  }

  // function undoAnim() {
  //   document.querySelectorAll(".skills-wrapper svg").forEach((item, i) => {
  //     let circle = Array.from(item.children).filter(function (child) {
  //       return child.classList.contains("cbar");
  //     });
  //     let r = circle[0].getAttribute("r");
  //     let c = Math.PI * (r * 2);
  //     let percent = circle[0].parentElement.parentElement.dataset.percent;
  //     let cbar = ((100 - percent) / 100) * c;
  //     circle[0].style.strokeDashoffset = 0;
  //     circle[0].style.strokeDasharray = 0;

  //     let smallC = Array.from(item.parentElement.children).filter(function (
  //       child
  //     ) {
  //       if (child.tagName === "SMALL") {
  //         return child;
  //       }
  //     });
  //     smallC[0].innerHTML = 0 + "%";
  //   });
  // }

  function animate(obj, initVal, lastVal, duration) {
    let startTime = null;
    const step = () => {
      let currentTime = Date.now();
      //if the start time is null, assign the current time to startTime
      if (!startTime) {
        startTime = currentTime;
      }
      //calculate the value to be used in calculating the number to be displayed
      const progress = Math.min((currentTime - startTime) / duration, 1);
      //calculate what to be displayed using the value gotten above
      obj.innerHTML =
        Math.floor(progress * (lastVal - initVal) + initVal) + "%";
      //checking to make sure the counter does not exceed the last value (lastVal)
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        window.cancelAnimationFrame(window.requestAnimationFrame(step));
      }
    };
    //start animating
    window.requestAnimationFrame(step);
  }

  function anim() {
    if (!tableCollapsed) {
      skillBarAnim();
    }
  }

  useEffect(() => {
    if (initialRun.current) {
      initialRun.current = false;
      return;
    }
    anim();
    return () => {}; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableCollapsed]);

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
              <h4>{caption}</h4>
            </>
          ) : (
            <>
              <HiOutlineChevronDoubleUp className="timeline-flex-collapsible-icon" />
              <h4 className="timeline-flex-title-dark">{caption}</h4>
            </>
          )}
        </div>
      </div>
      {!tableCollapsed && (
        <table
          className={
            tableCollapsed
              ? "timeline-legend-table tech-table-collapsed"
              : "timeline-legend-table tech-table"
          }
        >
          <tbody className="tablebody">
            <tr>
              <th>Technology</th>
              <th>Skills</th>
              <th>Description</th>
            </tr>
            {technologies.map((technology, i) => {
              return (
                <tr key={i}>
                  <td>
                    <a href={technology.techurl}>
                      {/* In case cloudinary fails to serve the images 
                      copy the images in path src/assets/images/technologies to the static folder
                      create your desired path structure there, for instance => assets/img/tech/<filename>
                      and change the src part of the image tag.
                      use the following commented out lines instead*/}
                      {/* <img
                        // src={`assets/img/tech/${technology.imgfilename}`}
                        alt={technology.skilltitle}
                      /> */}
                      <img
                        src={technology.imgurl}
                        alt={technology.skilltitle}
                      />
                    </a>
                    <br />
                    {technology.skilltitle}
                  </td>
                  <td>
                    <div
                      className={
                        tableCollapsed
                          ? "skills-wrapper invisible"
                          : "skills-wrapper"
                      }
                      data-percent={technology.skilllevel}
                    >
                      <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45"></circle>
                        <circle
                          className="cbar"
                          cx="50"
                          cy="50"
                          r="45"
                        ></circle>
                      </svg>
                      <small></small>
                    </div>
                  </td>
                  <td>{technology.skilldescription}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
};

export default TechTable;
