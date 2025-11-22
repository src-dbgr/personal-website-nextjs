import React, { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import { Environment, PerspectiveCamera } from "@react-three/drei";

// Dynamischer Import des Canvas
const DynamicCanvas = dynamic(
  () => import("@react-three/fiber").then((mod) => mod.Canvas),
  { ssr: false }
);

// Unser neuer Kristall
const DigitalCrystal = dynamic(() => import("./DigitalCrystal"), {
  ssr: false,
});

const ThreejsRender = () => {
  // STANDARDMÄSSIG AUS (false), wie im Original
  const [animation, setAnimation] = useState(false);

  const toggleAnimation = () => {
    setAnimation(!animation);
  };

  const brandGreen = "#00af64";
  const brandPurple = "#ac4a9c";

  let Content;

  if (animation) {
    // --- 3D ANSICHT ---
    Content = (
      <div style={{ width: "100%", height: "100%" }}>
        <DynamicCanvas
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            toneMappingExposure: 1.2,
            powerPreference: "high-performance", // Performance-Boost vom Original übernommen
          }}
          // Context-Lost-Handler vom Original übernommen für Stabilität
          onCreated={({ gl }) => {
            gl.domElement.addEventListener(
              "webglcontextlost",
              (event) => {
                event.preventDefault();
                console.warn("WebGL Context Lost recovered");
              },
              false
            );
          }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={35} />

          <Suspense fallback={null}>
            {/* Lokales Environment */}
            <Environment
              files="/assets/images/textures/snow_4k.hdr"
              background={false}
              blur={1}
            />

            {/* Licht-Setup */}
            <spotLight
              position={[10, 20, 10]}
              angle={0.3}
              penumbra={1}
              intensity={150}
              color="white"
            />
            <ambientLight intensity={0.5} />
            <pointLight
              position={[-4, -2, 2]}
              intensity={60}
              color={brandGreen}
              distance={10}
            />
            <pointLight
              position={[4, 2, 2]}
              intensity={60}
              color={brandPurple}
              distance={10}
            />

            {/* Der neue Kristall */}
            <DigitalCrystal />
          </Suspense>
        </DynamicCanvas>
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
