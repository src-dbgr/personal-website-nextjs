import React, { useRef } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import rock from "./Textures/rock.jpg";
import height from "./Textures/height.png";
import alpha from "./Textures/alpha.png";

const Plane = (props) => {
  // This reference will give us direct access to the mesh so we can animate it
  const mesh = useRef();
  const {
    clock, // THREE.Clock (useful for useFrame deltas)
  } = useThree();

  // Rotate mesh every frame, this is outside of React without overhead
  let sin = 0;
  useFrame(() => {
    sin = Math.sin(clock.elapsedTime / 3.5);
    mesh.current.rotation.x = -1.7;
    mesh.current.rotation.y = -0.1;
    mesh.current.position.y = -0.9;
    mesh.current.position.x = 0.2;
    mesh.current.position.z = 1.1;
    mesh.current.rotation.z = mesh.current.rotation.z += 0.003;
    mesh.current.material.displacementScale = sin + 0.5;
    mesh.current.material.emissiveIntensity = 0.8 * sin;
  });
  const textureMap = useLoader(TextureLoader, [rock, height, alpha]);

  return (
    <mesh {...props} ref={mesh}>
      <planeBufferGeometry attach="geometry" args={[3, 3, 32, 32]} />
      <meshStandardMaterial
        attach="material"
        map={textureMap[0]}
        displacementMap={textureMap[1]}
        alphaMap={textureMap[2]}
        displacementScale={0.5}
        transparent={true}
        depthTest={false}
        emissive={0x767081}
        emissiveIntensity={0}
        color={0x767081}
      />
    </mesh>
  );
};

export default Plane;
