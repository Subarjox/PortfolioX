import { describe, it, expect } from "vitest";
import { calculateCurvedVertices, calculateCardLayout } from "../src/utils/curvedMeshMath";
import { PROJECTS_DATA } from "../src/data/projectsData";

describe("Curved Mesh Math & Project Data", () => {
  it("should have exactly 6 projects with required fields", () => {
    expect(PROJECTS_DATA).toHaveLength(6);
    expect(PROJECTS_DATA[0].id).toBe("01");
    expect(PROJECTS_DATA[0].title).toContain("Oakley");
  });

  it("should calculate concave parabolic curvature (negative Z for non-zero X)", () => {
    const centerZ = calculateCurvedVertices(0, 0.15);
    const edgeZ = calculateCurvedVertices(2.0, 0.15);
    expect(centerZ).toBe(0);
    expect(edgeZ).toBeLessThan(0); // concave bend
  });

  it("should layout desktop cards with widened spacing (at least 4.5 units)", () => {
    const card0 = calculateCardLayout(0, 0.0, 6, false);
    const card1 = calculateCardLayout(1, 0.0, 6, false);
    const spacing = card1.x - card0.x;
    expect(spacing).toBeGreaterThanOrEqual(4.5);
    expect(card0.y).toBeCloseTo(0, 1);
  });

  it("should apply magnetic snap effect so projects lock cleanly without drifting", async () => {
    const { applyMagneticSnap } = await import("../src/utils/curvedMeshMath");
    // Center of project 01 (index 0)
    expect(applyMagneticSnap(0.0, 6)).toBe(0.0);
    // Center of project 02 (index 1 -> progress = 1/5 = 0.2)
    expect(applyMagneticSnap(0.2, 6)).toBe(0.2);
    // Center of project 06 (index 5 -> progress = 1.0)
    expect(applyMagneticSnap(1.0, 6)).toBe(1.0);

    // Near project 02 (progress 0.22): magnetic pull brings it closer to 0.2 than 0.22
    const near02 = applyMagneticSnap(0.22, 6);
    expect(Math.abs(near02 - 0.2)).toBeLessThan(0.02);
  });

  it("should layout mobile cards in staggered diagonal cascade", () => {
    const card0 = calculateCardLayout(0, 0.0, 6, true);
    const card1 = calculateCardLayout(1, 0.0, 6, true);
    expect(card1.x).toBeGreaterThan(card0.x);
    expect(card1.y).toBeGreaterThan(card0.y); // upper right
    expect(card1.z).toBeLessThan(card0.z); // deeper in Z
  });
});
