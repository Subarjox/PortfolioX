import { describe, it, expect } from "vitest";
import * as THREE from "three";
import { calculateCurvedVertices } from "../src/utils/curvedMeshMath";

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
});
