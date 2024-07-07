import {
  GlobalStateContext,
} from "../../../context/GlobalContextProvider";
import React, { Suspense, useState, useContext, useEffect, useRef } from "react";
import Sphere from "./Sphere";
import Tetrahedron from "./Tetrahedron";
import Plane from "./Plane";
import { Canvas } from "@react-three/fiber";
import { ResizeObserver } from "@juggle/resize-observer";

const ThreejsRender = () => {
  const [animation, setAnimation] = useState(false);
  const theme = useContext(GlobalStateContext).theme;
  const canvasRef = useRef(null);
  const [key, setKey] = useState(0); // Key to force re-render

  useEffect(() => {
    const handleContextLost = (event) => {
      event.preventDefault();
      console.error("WebGL context lost");
      // Optionally reinitialize the scene or reset the key to force re-render
      setKey(prevKey => prevKey + 1);
    };

    const handleContextRestored = () => {
      console.log("WebGL context restored");
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("webglcontextlost", handleContextLost, false);
      canvas.addEventListener("webglcontextrestored", handleContextRestored, false);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener("webglcontextlost", handleContextLost);
        canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      }
    };
  }, []);

  const toggleAnimation = () => {
    setAnimation(!animation);
  };

  return (
    <div className="animationWrapper">
      <div className="animationToggleWrapper">
        <div 
          className="animationToggle" 
          role="button" 
          tabIndex="0" 
          onClick={toggleAnimation} 
          onKeyDown={(e) => { if (e.key === 'Enter') toggleAnimation(); }}
        >
          {animation ? (<h5 className="stopAnim">STOP ANIMATION</h5>) : (<h5 className="startAnim">START ANIMATION</h5>)}
        </div>
        <svg className="arrows">
          <path d="M0 0l30 32L60 0" className="a1"></path>
          <path d="M0 20l30 32 30-32" className="a2"></path>
          <path d="M0 40l30 32 30-32" className="a3"></path>
        </svg>
      </div>
      {animation ? (
        <Suspense fallback={<div className="spinner-box">
          <div className="pulse-container">
            <div className="pulse-bubble pulse-bubble-1"></div>
            <div className="pulse-bubble pulse-bubble-2"></div>
            <div className="pulse-bubble pulse-bubble-3"></div>
          </div>
        </div>}>
          <Canvas
            key={key} // Force re-render on context loss
            ref={canvasRef}
            camera={{ fov: 75, near: 0.1, far: 500, position: [-2, 2, 3] }}
            className="trianglecanvas"
            resize={{ polyfill: ResizeObserver }}
          >
            <ambientLight />
            <pointLight position={[-3, 3, -2]} intensity={20} color={0x767081} />
            <pointLight position={[1, 1.5, 3]} intensity={20} color={0x35a169} />
            <pointLight position={[1, -1.5, -7]} intensity={10} color={0xb5b2a6} />
            <pointLight position={[2, 1, 4]} intensity={5} color={0x8f76be} />
            <Sphere position={[1, 0.5, 0]} />
            <Tetrahedron position={[1, 0.5, 0]} />
            {/* <Plane position={[1, 0, 0]} /> */}
          </Canvas>
        </Suspense>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width={250} height={250} id="logo_2">
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
              <stop offset={0} stopColor={`${theme === "dark" ? "#ac4a9c" : "rgb(61,139,104)"}`} />
              <stop offset={1} stopColor={`${theme === "dark" ? "#00af64" : "rgb(123,97,110)"}`} />
            </linearGradient>
          </defs>
          <path data-name="triangle nav" d="m0 0 124.3 250L250 0Z" fill="url(#rad_grad_a)" />
        </svg>
      )}
    </div>
  );
};

export default ThreejsRender;
