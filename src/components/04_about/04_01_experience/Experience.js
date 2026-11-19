import React, { useState } from "react";
import Title from "../../general/Title";
import { VscCircleFilled } from "react-icons/vsc";
import Link from "next/link";
import FadeInSection from "../../../hooks/FadeInSectionClient";

const Experience = ({ jobs }) => {
  const [value, setValue] = useState(0);

  if (!jobs?.length) {
    return null;
  }

  return (
    <section id="sctn_experience" className="section jobs">
      <Title title="Experience" />
      <FadeInSection>
        <div className="jobs-center">
          <div className="btn-container">
            {jobs.map((item, index) => (
              <button
                key={index}
                onClick={() => setValue(index)}
                className={`job-btn ${index === value ? "active-btn" : ""}`}
              >
                {item.short_company}
              </button>
            ))}
          </div>
          {/* All jobs share one grid cell, so the box is always as tall as
              the longest one at the current width: switching does not make
              the page jump. Only the selected one is visible (the others
              are hidden from screen readers and keyboard too). */}
          <div className="job-panels">
            {jobs.map(({ company, position, date, desc }, index) => (
              <article
                key={index}
                className={`job-info shadow-box ${
                  index === value ? "" : "job-info-hidden"
                }`}
              >
                <h3>{position}</h3>
                <h4>{company}</h4>
                <p className="job-date">{date}</p>
                {desc.map((description) => (
                  <div key={description.id} className="job-desc">
                    <VscCircleFilled className="job-icon" />
                    <p>{description.name}</p>
                  </div>
                ))}
              </article>
            ))}
          </div>
        </div>
      </FadeInSection>
      <Link href="/about" className="btn center-btn">
        more info<span className="visually-hidden"> about my experience</span>
      </Link>
    </section>
  );
};

export default Experience;
