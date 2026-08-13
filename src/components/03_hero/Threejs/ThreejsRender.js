import React, { useState } from "react";
import dynamic from "next/dynamic";

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
    // --- SVG ANSICHT (Fallback) ---
    Content = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={250}
        height={250}
        id="logo_2"
      >
        <defs>
          <linearGradient
            id="rad_grad_a"
            data-name="grad_trngl"
            x1={264.1}
            y1={130.6}
            x2={514.1}
            y2={130.6}
            gradientTransform="rotate(180 257.05 127.8)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset={0} stopColor="#ac4a9c" />
            <stop offset={1} stopColor="#00af64" />
          </linearGradient>
        </defs>
        <path
          data-name="triangle nav"
          d="m0 0 124.3 250L250 0Z"
          fill="url(#rad_grad_a)"
        />
      </svg>
    );
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
