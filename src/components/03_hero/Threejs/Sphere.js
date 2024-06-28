import React, { useRef, useState, useEffect, useCallback } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { TextureLoader } from "three";

const Sphere = (props) => {
  const mesh = useRef();
  const { mouse, clock } = useThree();

  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
  }, [hovered]);

  const handlePointerOver = useCallback(() => {
    setHover(true);
  }, []);

  const handlePointerOut = useCallback(() => {
    setHover(false);
  }, []);

  const handleClick = useCallback(() => {
    setActive(prev => !prev);
  }, []);

  useFrame(() => {
    const elapsedTime = clock.elapsedTime;
    const sin = Math.sin(elapsedTime / 10);
    const scaleValue = (sin + 0.2) * (active ? 1.8 : 0.8);
    mesh.current.rotation.x += 0.003 + Math.pow(mouse.x, 2) / 80;
    mesh.current.rotation.y += 0.003 + Math.pow(mouse.x, 2) / 80;
    mesh.current.position.y = 0.9 * Math.abs(Math.sin(elapsedTime / 5));
    mesh.current.material.emissiveIntensity = 0.9 * sin;
    mesh.current.material.opacity = 0.7 * Math.abs(Math.sin(elapsedTime / 3));
    mesh.current.scale.set(scaleValue, scaleValue, scaleValue);
  });

  const textureMap = useLoader(TextureLoader, [
    "/assets/images/textures/nm.jpg",
    "/assets/images/textures/normal.jpg",
  ]);

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [0.65, 0.65, 0.65] : [1.5, 1.5, 1.5]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
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
