import { describe, it, expect } from "vitest";
import { CURL_NOISE_GLSL } from "../src/shaders/gpgpu/curlNoise.glsl";
import { SIMULATION_FRAGMENT_SHADER } from "../src/shaders/gpgpu/simulation.frag";

describe("GPGPU Shaders", () => {
  it("contains curlNoise function and simplex 3D noise definition", () => {
    expect(CURL_NOISE_GLSL).toContain("vec3 curlNoise(vec3 p)");
    expect(CURL_NOISE_GLSL).toContain("float snoise(vec3 v)");
    expect(CURL_NOISE_GLSL).toContain("vec3 snoise3D(vec3 p)");
  });

  it("contains simulation uniforms and mouse repulsion logic", () => {
    expect(SIMULATION_FRAGMENT_SHADER).toContain("uniform sampler2D u_positions;");
    expect(SIMULATION_FRAGMENT_SHADER).toContain("uniform sampler2D u_origin;");
    expect(SIMULATION_FRAGMENT_SHADER).toContain("uniform vec3 u_mouse;");
    expect(SIMULATION_FRAGMENT_SHADER).toContain("if (d < u_dist");
    expect(SIMULATION_FRAGMENT_SHADER).toContain("u_repulsion_strength");
  });
});
