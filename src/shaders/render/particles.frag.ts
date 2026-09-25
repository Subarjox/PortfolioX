export const PARTICLE_FRAGMENT_SHADER = /* glsl */ `
precision highp float;

varying vec3 vPosition;
varying float vDistanceToCamera;

void main() {
  // Circular point coordinate check
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  if (dist > 0.5) {
    discard;
  }

  // Smooth Gaussian-like alpha falloff for glow
  float alpha = smoothstep(0.5, 0.05, dist);

  // High-End Luxury Color Palette (Gold / Warm White Gradient)
  vec3 gold = vec3(0.92, 0.78, 0.44); // Champagne gold
  vec3 white = vec3(1.0, 0.98, 0.94); // Glowing warm white

  // Modulate tint by vertical position and depth
  float t = clamp((vPosition.y + 1.5) / 3.0, 0.0, 1.0);
  vec3 color = mix(gold, white, t);

  gl_FragColor = vec4(color, alpha * 0.9);
}
`;
