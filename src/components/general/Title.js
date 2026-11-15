import React from "react";

// Page-level titles render as <h1> (as="h1"); section titles stay <h2>.
// Both look the same (see .section-title in globals.css).
const Title = ({ title, as: Heading = "h2" }) => {
  return (
    <div className="section-title">
      <Heading>{title || "default title"}</Heading>
      <div className="underline"></div>
    </div>
  );
};

export default Title;
