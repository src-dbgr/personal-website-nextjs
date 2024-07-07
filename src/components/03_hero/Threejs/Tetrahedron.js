import React, { useRef, useState, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";

const Tetrahedron = (props) => {
  const mesh = useRef();

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
  }, [hovered]);

  // Rotate mesh every frame, this is outside of React without overhead
  let addValue = 0;
  let elapsedTime = 0;
  useFrame(() => {
    elapsedTime = clock.elapsedTime;
    addValue = 0.0025 - (mouse.x * mouse.y) / 80;
    mesh.current.rotation.x = mesh.current.rotation.y += addValue
    mesh.current.rotation.y = mesh.current.rotation.x += addValue
    mesh.current.position.y = 0.9 * Math.abs(Math.sin(elapsedTime / 5));
    mesh.current.material.emissiveIntensity = 6 * Math.sin(elapsedTime);
  });

  const {
    mouse, // Current, centered, normalized 2D mouse coordinates
    clock, // THREE.Clock (useful for useFrame deltas)
  } = useThree();

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1, 1, 1] : [1.4, 1.4, 1.4]}
      onClick={(e) => setActive(!active)}
      onPointerOver={(e) => {
        setHover(true);
      }}
      onPointerOut={(e) => {
        setHover(false);
      }}
    >
      <tetrahedronBufferGeometry attach="geometry" args={[1.2, 0]} />
      <meshStandardMaterial
        attach="material"
        roughness={0.6}
        metalness={0.2}
        transparent={true}
        opacity={0.5}
        wireframe={active ? true : false}
        emissive={0x35a169}
        emissiveIntensity={0}
        color={0x35a169}
      />
    </mesh>
  );
};

export default Tetrahedron;
