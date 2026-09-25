import { describe, it, expect } from "vitest";
import { generateInitialParticleData, generateParticleUVs } from "../src/utils/particleData";

describe("Particle Data Utility", () => {
  it("generates float data of length size * size * 4", () => {
    const size = 128;
    const data = generateInitialParticleData(size);
    expect(data.length).toBe(size * size * 4);
    expect(Number.isNaN(data[0])).toBe(false);
    expect(Number.isNaN(data[1])).toBe(false);
    expect(Number.isNaN(data[2])).toBe(false);
    expect(Number.isNaN(data[3])).toBe(false);
  });

  it("generates normalized reference UV coordinates within [0, 1]", () => {
    const size = 64;
    const uvs = generateParticleUVs(size);
    expect(uvs.length).toBe(size * size * 2);
    expect(uvs[0]).toBeGreaterThanOrEqual(0);
    expect(uvs[0]).toBeLessThanOrEqual(1);
    expect(uvs[uvs.length - 1]).toBeGreaterThanOrEqual(0);
    expect(uvs[uvs.length - 1]).toBeLessThanOrEqual(1);
  });
});
