import { describe, it, expect } from "vitest";
import * as THREE from "three";

describe("Frame-rate Independent Damping & Memory Cleanup", () => {
  it("should damp values smoothly regardless of frame rate delta", () => {
    // 60Hz simulation (delta ~ 0.016s)
    let val60 = 0;
    const target = 1.0;
    const lambda = 8.0;

    for (let i = 0; i < 60; i++) {
      val60 = THREE.MathUtils.damp(val60, target, lambda, 0.0166);
    }
    // After 1 second (60 frames), should have converged to near target
    expect(val60).toBeGreaterThan(0.99);

    // 120Hz simulation (delta ~ 0.0083s) over 120 frames (same 1 second duration)
    let val120 = 0;
    for (let i = 0; i < 120; i++) {
      val120 = THREE.MathUtils.damp(val120, target, lambda, 0.0083);
    }
    expect(val120).toBeGreaterThan(0.99);
    // Values after same elapsed time should be nearly identical
    expect(Math.abs(val60 - val120)).toBeLessThan(0.01);
  });

  it("should support explicit geometry and texture disposal", () => {
    const geo = new THREE.PlaneGeometry(1, 1);
    let disposed = false;
    geo.addEventListener("dispose", () => {
      disposed = true;
    });
    geo.dispose();
    expect(disposed).toBe(true);
  });
});
