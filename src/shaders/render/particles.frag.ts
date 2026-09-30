export const PARTICLE_FRAGMENT_SHADER = /* glsl */ `
precision highp float;

varying vec3 vPosition;
varying float vDistanceToCamera;
varying float vAlpha;

void main() {
  // Circular point coordinate check
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  if (dist > 0.5) {
    discard;
  }

  // Crisp stippled point with tight anti-aliased perimeter
  float alpha = smoothstep(0.5, 0.32, dist);

  // Discrete crisp white with subtle warm silver/gold tint matching partikle.png
  vec3 gold = vec3(0.94, 0.88, 0.76); // Subtle warm gold
  vec3 white = vec3(0.98, 0.98, 1.0); // Crisp silver white

  float t = clamp((vPosition.z + 0.08) / 0.16, 0.0, 1.0);
  vec3 color = mix(gold, white, t);

  gl_FragColor = vec4(color, alpha * vAlpha);
}
`;
