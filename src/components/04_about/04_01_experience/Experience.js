import React, { useState } from "react";
import Title from "../../general/Title";
import { VscCircleFilled } from "react-icons/vsc";
import Link from "next/link";
import FadeInSection from "../../../hooks/FadeInSection";

const Experience = ({ jobs }) => {
  const [value, setValue] = useState(0);
  const { company, position, date, desc } = jobs[value];

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
          <article className="job-info shadow-box">
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
        </div>
      </FadeInSection>
      <Link href="/about#paimg" legacyBehavior>
        <a className="btn center-btn">more info</a>
      </Link>
    </section>
  );
};

export default Experience;
