import { describe, it, expect } from "vitest";
import { ROTATING_WORDS } from "../src/constants/textSequence";
import { generateTextParticleData, createPositionDataTexture } from "../src/utils/particleData";

describe("Text Rotation and Word Sequence", () => {
  it("has the exact sequence: fahreza -> AI Engineer -> Software Engineer", () => {
    expect(ROTATING_WORDS).toEqual(["fahreza", "AI Engineer", "Software Engineer"]);
    expect(ROTATING_WORDS).toHaveLength(3);
  });

  it("generates valid particle data for each phrase in the sequence", () => {
    const size = 48;
    const count = size * size;

    for (const phrase of ROTATING_WORDS) {
      const data = generateTextParticleData(phrase, size);
      expect(data).toHaveLength(count * 4);

      // Verify no NaN or infinity in particle positions
      for (let i = 0; i < Math.min(100, data.length); i++) {
        expect(Number.isNaN(data[i])).toBe(false);
        expect(Number.isFinite(data[i])).toBe(true);
      }

      // Verify texture creation
      const texture = createPositionDataTexture(size, phrase);
      expect(texture).toBeDefined();
      expect(texture.image.width).toBe(size);
      expect(texture.image.height).toBe(size);
      texture.dispose();
    }
  });
});
