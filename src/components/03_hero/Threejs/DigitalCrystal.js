import React, { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  MeshTransmissionMaterial,
  Float,
  PresentationControls,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";

// --- TEIL C: DER GLAS-KERN (Sichtbar & Interaktiv) ---
const InteractiveGlassCore = () => {
  const glassRef = useRef();
  const innerRef = useRef();
  const materialRef = useRef();
  const autoRotateRef = useRef();

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const slowBreath = Math.sin(t * 0.4);

    // Auto-Rotation
    if (autoRotateRef.current) {
      autoRotateRef.current.rotation.y += delta * 0.25;
      autoRotateRef.current.rotation.x = Math.sin(t * 0.5) * 0.15;
      autoRotateRef.current.rotation.z = Math.cos(t * 0.3) * 0.1;
    }

    // Pulsieren & Levitation
    const glassScale = THREE.MathUtils.mapLinear(slowBreath, -1, 1, 0.8, 1.2);
    const levitationY = Math.sin(t * 0.4) * 0.2;

    if (glassRef.current) {
      glassRef.current.scale.setScalar(glassScale);
      glassRef.current.position.y = levitationY;
    }

    // Material Transparenz
    const trans = THREE.MathUtils.mapLinear(slowBreath, -1, -0.2, 0.1, 1);

    // Roughness-Pulsation zwischen 0.05 und 0.3
    const roughnessValue = THREE.MathUtils.mapLinear(
      slowBreath,
      -1,
      1,
      0.0,
      0.3
    );

    // Pulsation zwischen 0.5 und 1.5, um die Knoten optisch zu verschieben (Distortion wird nicht gesetzt, aber der Wert wird berechnet)
    const distortionPulsation = THREE.MathUtils.mapLinear(
      slowBreath,
      -1,
      1,
      0.5,
      1.5
    );

    // NEU: Farbe und Intensität für den GLOW (Bloom)
    // Die Luminanz muss über 1 liegen, damit der Bloom-Effekt greift.
    const glowColor = slowBreath < 0 ? "#aaffcc" : "#ffffff";
    const colorIntensity = THREE.MathUtils.mapLinear(
      slowBreath,
      -1,
      1,
      3.0,
      5.0
    ); // Intensität > 1!

    if (materialRef.current) {
      materialRef.current.transmission = THREE.MathUtils.clamp(trans, 0.1, 1);

      // ANPASSUNG: Farbe setzen und mit hoher Intensität multiplizieren für GLOW
      materialRef.current.color.lerp(
        new THREE.Color(glowColor).multiplyScalar(colorIntensity),
        0.02
      );

      // ANPASSUNG: Roughness setzen
      materialRef.current.roughness = roughnessValue;
    }

    // Kern
    if (innerRef.current) {
      innerRef.current.position.y = levitationY;
      innerRef.current.rotation.x = t * 0.4;
      innerRef.current.rotation.z = t * 0.2;
    }
  });

  // Farben (unverändert)
  const brandPurple = "#ac4a9c";
  const brandGreen = "#00af64";

  return (
    <group ref={autoRotateRef}>
      {/* GLAS */}
      <mesh ref={glassRef}>
        <icosahedronGeometry args={[1, 0]} />
        <MeshTransmissionMaterial
          ref={materialRef}
          backside={true}
          samples={8}
          resolution={512}
          transmission={1}
          roughness={0.0}
          thickness={2.5}
          ior={1.5}
          chromaticAberration={1.0}
          anisotropy={0.5}
          distortion={0.5}
          distortionScale={0.5}
          temporalDistortion={0.1}
          color="#ffffff" // Helles Glas
          attenuationDistance={5.0}
          attenuationColor="#ffffff"
          // WICHTIG: Deaktiviert Tone Mapping, um HDR-Farben (Luminanz > 1) zu erlauben
          toneMapped={false}
        />
      </mesh>

      {/* KERN */}
      <mesh ref={innerRef} scale={0.4}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial
          color={brandGreen}
          wireframe={true}
          transparent={true}
          opacity={0.8}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};

// --- HAUPTKOMPONENTE ---
const DigitalCrystal = () => {
  const { viewport } = useThree();
  const responsiveScale = Math.min(1, viewport.width / 6);

  return (
    <group dispose={null} scale={responsiveScale}>
      <Float speed={0} rotationIntensity={0} floatIntensity={0}>
        {/* 3. Der sichtbare Kristall */}
        <PresentationControls
          global={false}
          cursor={true}
          snap={false}
          speed={2}
          zoom={0.8}
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Infinity, Infinity]}
          config={{ mass: 2, tension: 150, friction: 20 }}
        >
          <InteractiveGlassCore />
        </PresentationControls>
      </Float>
    </group>
  );
};

export default DigitalCrystal;
