import { describe, it, expect } from "vitest";
import { PARTICLE_VERTEX_SHADER } from "../src/shaders/render/particles.vert";
import { PARTICLE_FRAGMENT_SHADER } from "../src/shaders/render/particles.frag";

describe("Render Shaders", () => {
  it("vertex shader binds u_positions and sets gl_PointSize with size attenuation", () => {
    expect(PARTICLE_VERTEX_SHADER).toContain("uniform sampler2D u_positions;");
    expect(PARTICLE_VERTEX_SHADER).toContain("attribute vec2 reference;");
    expect(PARTICLE_VERTEX_SHADER).toContain("gl_PointSize = 2.0");
    expect(PARTICLE_VERTEX_SHADER).toContain("-mvPosition.z");
  });

  it("fragment shader applies smooth alpha blending and gold/white palette", () => {
    expect(PARTICLE_FRAGMENT_SHADER).toContain("gl_PointCoord");
    expect(PARTICLE_FRAGMENT_SHADER).toContain("discard");
    expect(PARTICLE_FRAGMENT_SHADER).toContain("vec3 gold");
    expect(PARTICLE_FRAGMENT_SHADER).toContain("vec3 white");
    expect(PARTICLE_FRAGMENT_SHADER).toContain("smoothstep");
  });
});
