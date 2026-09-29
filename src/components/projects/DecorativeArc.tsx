"use client";

import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface DecorativeArcProps {
  progress: number;
  isMobile: boolean;
}

/**
 * Renders the signature vibrant blue curved ribbon stroke
 * appearing between cards 01 and 02 matching misc/Project List.png.
 */
export function DecorativeArc({ progress, isMobile }: DecorativeArcProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const tubeGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const count = 24;
    for (let i = 0; i <= count; i++) {
      const t = (i / count) * Math.PI;
      const x = Math.sin(t) * 0.45;
      const y = -Math.cos(t) * 0.6;
      const z = Math.sin(t) * 0.1;
      points.push(new THREE.Vector3(x, y, z));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(curve, 32, 0.024, 8, false);
  }, []);

  // Clean up geometry on unmount
  useEffect(() => {
    return () => {
      tubeGeometry.dispose();
    };
  }, [tubeGeometry]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    if (isMobile) {
      meshRef.current.visible = false;
      return;
    }
    meshRef.current.visible = true;

    const midpointX = (0.5 - progress * 5) * 3.6;
    const lambda = 8.5;

    meshRef.current.position.x = THREE.MathUtils.damp(
      meshRef.current.position.x,
      midpointX,
      lambda,
      delta
    );
    meshRef.current.position.y = -0.1;
    meshRef.current.position.z = 0.2;
    meshRef.current.rotation.z = -0.35;
  });

  return (
    <mesh ref={meshRef} geometry={tubeGeometry}>
      <meshBasicMaterial color="#2563eb" toneMapped={false} />
    </mesh>
  );
}
