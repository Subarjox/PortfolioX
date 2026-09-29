import { describe, it, expect } from "vitest";
import { calculateScrollProgress } from "../src/hooks/useProjectsScroll";

describe("Scroll Progress Calculation", () => {
  it("should return 0 when section is at or below viewport bottom", () => {
    // sectionTop = 1000, viewportHeight = 800
    expect(calculateScrollProgress(800, 3000, 800)).toBe(0);
    expect(calculateScrollProgress(1000, 3000, 800)).toBe(0);
  });

  it("should return 1 when section has fully completed its scroll track", () => {
    // track distance = sectionHeight - viewportHeight = 3000 - 800 = 2200
    // when sectionTop = -2200, progress is 1.0
    expect(calculateScrollProgress(-2200, 3000, 800)).toBe(1);
    expect(calculateScrollProgress(-2500, 3000, 800)).toBe(1); // strictly clamped
  });

  it("should return linear progress between 0.0 and 1.0", () => {
    expect(calculateScrollProgress(-1100, 3000, 800)).toBeCloseTo(0.5, 2);
  });
});
