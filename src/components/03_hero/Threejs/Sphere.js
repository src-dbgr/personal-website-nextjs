import React, { useRef, useState, useEffect } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { TextureLoader } from "three";

const Sphere = (props) => {
  // This reference will give us direct access to the mesh so we can animate it
  const mesh = useRef();

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
  }, [hovered]);

  // Rotate mesh every frame, this is outside of React without overhead
  let sin = 0;
  let elapsedTime = 0;
  let scaleValue = 0;
  useFrame(() => {
    elapsedTime = clock.elapsedTime;
    sin = Math.sin(elapsedTime / 10);
    scaleValue = (sin + 0.2) * (active ? 1.8 : 0.8);
    mesh.current.rotation.x = mesh.current.rotation.y +=
      0.003 + Math.pow(mouse.x, 2) / 80;
    mesh.current.position.y = 0.9 * Math.abs(Math.sin(elapsedTime / 5));
    mesh.current.material.emissiveIntensity = 0.9 * sin;
    mesh.current.material.opacity = 0.7 * Math.abs(Math.sin(elapsedTime / 3));
    mesh.current.scale.x = scaleValue;
    mesh.current.scale.y = scaleValue;
    mesh.current.scale.z = scaleValue;
  });

  const {
    mouse, // Current, centered, normalized 2D mouse coordinates
    clock, // THREE.Clock (useful for useFrame deltas)
  } = useThree();

  const textureMap = useLoader(TextureLoader, [
    "/assets/images/textures/nm.jpg",
    "/assets/images/textures/normal.jpg",
  ]);

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [0.65, 0.65, 0.65] : [1.5, 1.5, 1.5]}
      onClick={(e) => setActive(!active)}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}
    >
      <sphereBufferGeometry attach="geometry" args={[0.8, 32, 32]} />
      <meshStandardMaterial
        attach="material"
        roughness={0.5}
        metalness={0.5}
        fog={true}
        transparent={true}
        opacity={0.5}
        wireframe={true}
        emissive={0x767081}
        emissiveIntensity={0.5}
        color={0x35a169}
        alphaMap={textureMap[0]}
        roughnessMap={textureMap[1]}
      />
    </mesh>
  );
};

export default Sphere;
