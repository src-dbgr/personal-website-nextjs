import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import DigitalCrystal from "./DigitalCrystal";

const brandGreen = "#00af64";
const brandPurple = "#ac4a9c";

const HeroCanvas = () => {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        toneMappingExposure: 1.2,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener(
          "webglcontextlost",
          (event) => {
            event.preventDefault();
          },
          false
        );
      }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={35} />

      <Suspense fallback={null}>
        <Environment
          files="/assets/images/textures/snow_4k.hdr"
          background={false}
          blur={1}
        />

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

        <DigitalCrystal />
      </Suspense>
    </Canvas>
  );
};

export default HeroCanvas;
