import React, { useState } from "react";
import dynamic from "next/dynamic";
import LiquidLogo from "../LiquidLogo";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), {
  ssr: false,
});

const ThreejsRender = () => {
  const [animation, setAnimation] = useState(false);

  const toggleAnimation = () => {
    setAnimation(!animation);
  };

  let Content;

  if (animation) {
    Content = (
      <div style={{ width: "100%", height: "100%" }}>
        <HeroCanvas />
      </div>
    );
  } else {
    // Static view: the logo triangle in liquid metal (SVG fallback inside).
    Content = <LiquidLogo />;
  }

  return (
    <div className="animationWrapper" style={{ width: "100%", height: "100%" }}>
      <div className="animationToggleWrapper" onClick={toggleAnimation}>
        <div className="animationToggle" role="button" tabIndex="0">
          <h5 className={animation ? "stopAnim" : "startAnim"}>
            {animation ? "STOP ANIMATION" : "START ANIMATION"}
          </h5>
        </div>
        <svg className="arrows">
          <path d="M0 0l30 32L60 0" className="a1"></path>
          <path d="M0 20l30 32 30-32" className="a2"></path>
          <path d="M0 40l30 32 30-32" className="a3"></path>
        </svg>
      </div>
      {Content}
    </div>
  );
};

export default ThreejsRender;
