import { describe, it, expect } from "vitest";
import * as THREE from "three";
import { calculateCurvedVertices, calculateDynamicCurveFactor } from "../src/utils/curvedMeshMath";

describe("Curved Mesh Geometry Verification", () => {
  it("should generate a segmented curved plane geometry", () => {
    const geo = new THREE.PlaneGeometry(3, 2, 32, 1);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = calculateCurvedVertices(x, 0.12);
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
    expect(pos.getZ(0)).toBeLessThan(0); // outer edges bow backwards
  });

  it("should dynamically flatten to a perfect flat rectangle when centered and bend when scrolled", () => {
    const geo = new THREE.PlaneGeometry(3.4, 2.2, 32, 1);
    const pos = geo.attributes.position;

    // 1. In center (absDiff = 0): perfectly flat rectangle (kotak sempurna)
    const centerCurve = calculateDynamicCurveFactor(0, 0.11);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      pos.setZ(i, calculateCurvedVertices(x, centerCurve));
    }
    pos.needsUpdate = true;

    // Every single vertex in the mesh has Z = 0
    for (let i = 0; i < pos.count; i++) {
      expect(pos.getZ(i)).toBe(0);
    }

    // 2. Scrolled away (absDiff = 1.0): curved cylinder (sedikit melengkung)
    const scrolledCurve = calculateDynamicCurveFactor(1.0, 0.11);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      pos.setZ(i, calculateCurvedVertices(x, scrolledCurve));
    }
    pos.needsUpdate = true;

    // Center vertex is at Z = 0, edge vertices have negative Z (curved bend)
    expect(pos.getZ(16)).toBeCloseTo(0, 4); // center column
    expect(pos.getZ(0)).toBeLessThan(0); // leftmost edge
    expect(pos.getZ(32)).toBeLessThan(0); // rightmost edge
  });
});
