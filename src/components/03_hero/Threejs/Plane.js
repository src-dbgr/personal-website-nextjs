import React, { useRef } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { TextureLoader } from "three";

const Plane = React.memo((props) => {
  const mesh = useRef();
  const { clock } = useThree();
  const [map, displacementMap, alphaMap] = useLoader(TextureLoader, [
    "./assets/images/textures/rock.jpg",
    "./assets/images/textures/height.png",
    "./assets/images/textures/alpha.png"
  ]);

  useFrame(() => {
    const sin = Math.sin(clock.getElapsedTime() / 7);
    mesh.current.rotation.x = -1.7;
    mesh.current.rotation.y = -0.1;
    mesh.current.position.y = -0.9;
    mesh.current.position.x = 0.2;
    mesh.current.position.z = 1.1;
    mesh.current.rotation.z += 0.003;
    mesh.current.material.displacementScale = Math.abs(sin) * 2;
    mesh.current.material.emissiveIntensity = Math.abs(sin) * 2;
    mesh.current.material.opacity = 1; // Opacity-Einstellung
  });

  return (
    <mesh {...props} ref={mesh}>
      <planeBufferGeometry args={[3, 3, 32, 32]} />
      <meshStandardMaterial
        map={map}
        displacementMap={displacementMap}
        alphaMap={alphaMap}
        displacementScale={0.5}
        transparent={true}
        depthTest={false}
        emissive={0x767081}
        emissiveIntensity={0}
        color={0x767081}
      />
    </mesh>
  );
});

Plane.displayName = "Plane";

export default Plane;
