import { describe, it, expect } from "vitest";
import { OrbitalRings } from "../src/components/canvas/OrbitalRings";
import { PARTICLE_VERTEX_SHADER } from "../src/shaders/render/particles.vert";
import { PARTICLE_FRAGMENT_SHADER } from "../src/shaders/render/particles.frag";

describe("Particle Hover Color & Clean Scene Configuration", () => {
  it("verifies OrbitalRings effect is disabled/null per user request", () => {
    expect(OrbitalRings()).toBeNull();
  });

  it("verifies vertex shader binds u_mouse, u_hover_radius, and outputs vHover", () => {
    expect(PARTICLE_VERTEX_SHADER).toContain("uniform vec3 u_mouse;");
    expect(PARTICLE_VERTEX_SHADER).toContain("uniform float u_hover_radius;");
    expect(PARTICLE_VERTEX_SHADER).toContain("varying float vHover;");
    expect(PARTICLE_VERTEX_SHADER).toContain("smoothstep(0.0, u_hover_radius, mouseDist)");
  });

  it("verifies fragment shader blends smoothly to blue in the hover zone", () => {
    expect(PARTICLE_FRAGMENT_SHADER).toContain("varying float vHover;");
    expect(PARTICLE_FRAGMENT_SHADER).toContain("vec3 blueDeep");
    expect(PARTICLE_FRAGMENT_SHADER).toContain("vec3 blueCyan");
    expect(PARTICLE_FRAGMENT_SHADER).toContain("vec3 hoverBlue");
    expect(PARTICLE_FRAGMENT_SHADER).toContain("mix(baseColor, hoverBlue, vHover)");
  });
});
