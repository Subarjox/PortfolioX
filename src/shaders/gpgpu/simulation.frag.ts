import { CURL_NOISE_GLSL } from "./curlNoise.glsl";

export const SIMULATION_FRAGMENT_SHADER = /* glsl */ `
precision highp float;

uniform sampler2D u_positions;
uniform sampler2D u_origin;
uniform vec3 u_mouse;
uniform float u_dist;
uniform float u_repulsion_strength;
uniform float u_time;
uniform float u_delta;
uniform float u_curl_freq;
uniform float u_curl_speed;

varying vec2 vUv;

${CURL_NOISE_GLSL}

void main() {
  vec4 posData = texture2D(u_positions, vUv);
  vec3 p = posData.xyz;
  float life = posData.w;

  // 1. Curl Noise Fluid Advection
  vec3 curl = curlNoise(p * u_curl_freq + vec3(0.0, 0.0, u_time * u_curl_speed));
  p += curl * u_delta * 0.45;

  // 2. Mouse Repulsion Area: if (length(p - u_mouse) < dist) { ... }
  vec3 diff = p - u_mouse;
  float d = length(diff);
  if (d < u_dist && d > 0.0001) {
    float factor = 1.0 - (d / u_dist);
    // Smooth quadratic ease-out repulsion
    p += normalize(diff) * (factor * factor) * u_repulsion_strength;
  }

  // 3. Boundary & Reset Logic: keep particles within aesthetic bounding sphere
  vec3 origin = texture2D(u_origin, vUv).xyz;
  float distToCenter = length(p);
  if (distToCenter > 4.5) {
    // Gentle recovery towards initial origin
    p = mix(p, origin, 0.05);
  }

  gl_FragColor = vec4(p, life);
}
`;
