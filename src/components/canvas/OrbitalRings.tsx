"use client";

import { useMemo } from "react";
import * as THREE from "three";

export function OrbitalRings() {
  const lineMesh1 = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, 2.75, 0.9, 0, 2 * Math.PI, false, 0);
    const points = curve.getPoints(160);
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.08,
    });
    const line = new THREE.Line(geo, mat);
    line.rotation.set(0.42, 0.15, -0.08);
    return line;
  }, []);

  const lineMesh2 = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, 2.85, 0.72, 0, 2 * Math.PI, false, 0);
    const points = curve.getPoints(160);
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.06,
    });
    const line = new THREE.Line(geo, mat);
    line.rotation.set(-0.38, -0.2, 0.12);
    return line;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      <primitive object={lineMesh1} />
      <primitive object={lineMesh2} />
    </group>
  );
}
