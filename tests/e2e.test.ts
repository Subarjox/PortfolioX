import { describe, it, expect } from "vitest";
import { generateInitialParticleData, generateParticleUVs } from "../src/utils/particleData";
import { CURL_NOISE_GLSL } from "../src/shaders/gpgpu/curlNoise.glsl";
import { SIMULATION_FRAGMENT_SHADER } from "../src/shaders/gpgpu/simulation.frag";
import { PARTICLE_VERTEX_SHADER } from "../src/shaders/render/particles.vert";
import { PARTICLE_FRAGMENT_SHADER } from "../src/shaders/render/particles.frag";

describe("E2E Architecture Alignment", () => {
  it("verifies full pipeline constants and data alignment", () => {
    const size = 512;
    const count = size * size;
    const positions = generateInitialParticleData(size);
    const uvs = generateParticleUVs(size);

    // Verify 512x512 = 262,144 particles
    expect(count).toBe(262144);
    expect(positions.length).toBe(count * 4);
    expect(uvs.length).toBe(count * 2);

    // Verify compute shader bindings
    expect(SIMULATION_FRAGMENT_SHADER).toContain("u_mouse");
    expect(SIMULATION_FRAGMENT_SHADER).toContain("curlNoise");
    expect(SIMULATION_FRAGMENT_SHADER).toContain("u_positions");
    expect(SIMULATION_FRAGMENT_SHADER).toContain("u_origin");

    // Verify render shader bindings
    expect(PARTICLE_VERTEX_SHADER).toContain("u_positions");
    expect(PARTICLE_VERTEX_SHADER).toContain("reference");
    expect(PARTICLE_FRAGMENT_SHADER).toContain("gl_PointCoord");
  });
});
