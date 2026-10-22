import { describe, it, expect } from "vitest";
import { ROTATING_WORDS } from "../src/constants/textSequence";
import { generateTextParticleData, createPositionDataTexture, generateAvatarParticleData } from "../src/utils/particleData";

describe("Text Rotation and Word Sequence", () => {
  it("has valid sequence with AI ENGINEER, SOFTWARE ENGINEER, and AVATAR", () => {
    expect(ROTATING_WORDS.map((w) => w.toLowerCase())).toEqual([
      "ai engineer",
      "software engineer",
      "avatar",
    ]);
    expect(ROTATING_WORDS).toHaveLength(3);
  });

  it("generates valid particle data for each phrase in the sequence", () => {
    const size = 110;
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

  it("generates valid avatar particle positions and 3D depth from partikel.json", () => {
    const size = 110;
    const data = generateAvatarParticleData(size);
    expect(data).toHaveLength(size * size * 4);

    let hasNaN = false;
    let maxAbs = 0;
    for (let i = 0; i < data.length; i++) {
      if (Number.isNaN(data[i])) hasNaN = true;
      if (Math.abs(data[i]) > maxAbs) maxAbs = Math.abs(data[i]);
    }
    expect(hasNaN).toBe(false);
    expect(maxAbs).toBeLessThan(10.0);
  });
});
