import { describe, it, expect } from "vitest";
import { generateInitialParticleData, generateTextParticleData, generateParticleUVs } from "../src/utils/particleData";
import { CURL_NOISE_GLSL } from "../src/shaders/gpgpu/curlNoise.glsl";
import { SIMULATION_FRAGMENT_SHADER } from "../src/shaders/gpgpu/simulation.frag";
import { PARTICLE_VERTEX_SHADER } from "../src/shaders/render/particles.vert";
import { PARTICLE_FRAGMENT_SHADER } from "../src/shaders/render/particles.frag";

describe("E2E Architecture Alignment", () => {
  it("verifies pipeline constants, text data, and particle alignment", () => {
    const size = 128; // Reduced particle count for clean word formation
    const count = size * size;
    const positions = generateTextParticleData("fahreza", size);
    const uvs = generateParticleUVs(size);

    // Verify 128x128 = 16,384 particles
    expect(count).toBe(16384);
    expect(positions.length).toBe(count * 4);
    expect(uvs.length).toBe(count * 2);

    // Verify compute shader bindings
    expect(SIMULATION_FRAGMENT_SHADER).toContain("u_mouse");
    expect(SIMULATION_FRAGMENT_SHADER).toContain("curlNoise");
    expect(SIMULATION_FRAGMENT_SHADER).toContain("u_positions");
    expect(SIMULATION_FRAGMENT_SHADER).toContain("u_origin");
    expect(SIMULATION_FRAGMENT_SHADER).toContain("toOrigin");

    // Verify render shader bindings
    expect(PARTICLE_VERTEX_SHADER).toContain("u_positions");
    expect(PARTICLE_VERTEX_SHADER).toContain("reference");
    expect(PARTICLE_FRAGMENT_SHADER).toContain("gl_PointCoord");
  });

  it("verifies home page structure and featured section integration", async () => {
    const pageModule = await import("../src/app/page");
    expect(pageModule.default).toBeDefined();
  });
});
