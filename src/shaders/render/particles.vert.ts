export const PARTICLE_VERTEX_SHADER = /* glsl */ `
uniform sampler2D u_positions;
uniform float u_pixelRatio;
uniform float u_size;

attribute vec2 reference;

varying vec3 vPosition;
varying float vDistanceToCamera;

void main() {
  // Sample position computed in GPGPU FBO pass
  vec4 posData = texture2D(u_positions, reference);
  vec3 pos = posData.xyz;

  vPosition = pos;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  vDistanceToCamera = -mvPosition.z;

  // Size attenuation: discrete points shrink proportionally with camera distance
  gl_PointSize = 2.0 * u_size * u_pixelRatio * (300.0 / -mvPosition.z);
  gl_PointSize = clamp(gl_PointSize, 1.0, 18.0);
}
`;
