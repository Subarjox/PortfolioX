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

  it("should layout desktop cards horizontally along X axis", () => {
    const card0 = calculateCardLayout(0, 0.0, 6, false);
    const card1 = calculateCardLayout(1, 0.0, 6, false);
    expect(card1.x).toBeGreaterThan(card0.x);
    expect(card0.y).toBeCloseTo(0, 1);
  });

  it("should layout mobile cards in staggered diagonal cascade", () => {
    const card0 = calculateCardLayout(0, 0.0, 6, true);
    const card1 = calculateCardLayout(1, 0.0, 6, true);
    expect(card1.x).toBeGreaterThan(card0.x);
    expect(card1.y).toBeGreaterThan(card0.y); // upper right
    expect(card1.z).toBeLessThan(card0.z); // deeper in Z
  });
});
