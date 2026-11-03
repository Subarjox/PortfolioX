export const PARTICLE_VERTEX_SHADER = /* glsl */ `
uniform sampler2D u_positions;
uniform float u_pixelRatio;
uniform float u_size;
uniform vec3 u_mouse;
uniform float u_hover_radius;

attribute vec2 reference;

varying vec3 vPosition;
varying float vDistanceToCamera;
varying float vAlpha;
varying float vHover;

void main() {
  // Sample position computed in GPGPU FBO pass
  vec4 posData = texture2D(u_positions, reference);
  vec3 pos = posData.xyz;

  vPosition = pos;
  vAlpha = 0.5 + 0.5 * posData.w;

  // Calculate smooth proximity to hover cursor in world space
  float mouseDist = length(pos.xy - u_mouse.xy);
  float hover = 1.0 - smoothstep(0.0, u_hover_radius, mouseDist);
  vHover = clamp(hover, 0.0, 1.0);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  vDistanceToCamera = -mvPosition.z;

  // Size attenuation: discrete points shrink proportionally with camera distance
  // Slightly boost point size in hover zone for luminous presence matching hover_test.png
  float sizeBoost = 1.0 + vHover * 0.35;
  gl_PointSize = 2.0 * u_size * sizeBoost * u_pixelRatio * (5.5 / -mvPosition.z);
  gl_PointSize = clamp(gl_PointSize, 1.2, 4.0 * u_pixelRatio);
}
`;
