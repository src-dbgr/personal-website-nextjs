import { GlobalStateContext } from "../../../context/GlobalContextProvider";
import React, { Suspense, useState, useContext } from "react";
import dynamic from "next/dynamic";

// Eine leere Komponente als Platzhalter während die Textur lädt
// Damit bleibt der Canvas aktiv, auch wenn die Kugel noch nicht da ist.
const Loader = () => null;

const ThreejsRender = () => {
  const [animation, setAnimation] = useState(false);
  // theme wird hier geladen, falls du es später für Farben brauchst
  const theme = useContext(GlobalStateContext).theme;

  const toggleAnimation = () => {
    setAnimation(!animation);
  };

  let Content;

  if (animation) {
    // Wir importieren den Canvas dynamisch, damit SSR (Server Side Rendering) nicht meckert
    const DynamicCanvas = dynamic(
      () => import("@react-three/fiber").then((mod) => mod.Canvas),
      { ssr: false }
    );

    // Die 3D-Objekte importieren wir auch dynamisch
    const Sphere = dynamic(() => import("./Sphere"), { ssr: false });
    const Tetrahedron = dynamic(() => import("./Tetrahedron"), { ssr: false });

    Content = (
      <div style={{ width: "100%", height: "100%" }}>
        <DynamicCanvas
          camera={{ fov: 75, near: 0.1, far: 500, position: [-2, 2, 3] }}
          className="trianglecanvas"
          // WICHTIG: Alpha an, damit wir Transparenz haben
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
          }}
          // WICHTIG: Event Listener für Context Lost, um Crash abzufangen
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0); // Hintergrund sofort transparent

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
          {/* Lichter benötigen keine Texturen, sie sind sofort da */}
          <ambientLight intensity={0.5} />
          <pointLight
            position={[-3, 3, -2]}
            intensity={20}
            color={0x767081}
            decay={0.5}
          />
          <pointLight
            position={[1, 1.5, 3]}
            intensity={20}
            color={0x35a169}
            decay={0.5}
          />
          <pointLight
            position={[1, -1.5, -7]}
            intensity={10}
            color={0xb5b2a6}
            decay={0.5}
          />
          <pointLight
            position={[2, 1, 4]}
            intensity={5}
            color={0x8f76be}
            decay={0.5}
          />

          {/* HIER IST DER FIX: 
             Suspense ist INNERHALB des Canvas. 
             Der Canvas stürzt nicht mehr ab, wenn die Textur lädt.
          */}
          <Suspense fallback={<Loader />}>
            <Sphere position={[1, 0.5, 0]} />
            <Tetrahedron position={[1, 0.5, 0]} />
          </Suspense>
        </DynamicCanvas>
      </div>
    );
  } else {
    // Das statische SVG Bild (wenn Animation aus ist)
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
    <div className="animationWrapper">
      <div className="animationToggleWrapper">
        <div
          className="animationToggle"
          role="button"
          tabIndex="0"
          onClick={toggleAnimation}
          onKeyDown={(e) => {
            if (e.key === "Enter") toggleAnimation();
          }}
        >
          {animation ? (
            <h5 className="stopAnim">STOP ANIMATION</h5>
          ) : (
            <h5 className="startAnim">START ANIMATION</h5>
          )}
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
