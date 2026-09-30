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
uniform float u_dispersion;
uniform float u_dispersion_seed;

varying vec2 vUv;

${CURL_NOISE_GLSL}

void main() {
  vec4 posData = texture2D(u_positions, vUv);
  vec3 p = posData.xyz;
  float life = posData.w;

  vec3 origin = texture2D(u_origin, vUv).xyz;

  // 1. Gentle Flowing Dispersion Phase (reduced by 70%, fluid-like slow stream flow)
  if (u_dispersion > 0.001) {
    // Slower, graceful 3D fluid curl noise eddies ("seolah olah seperti mengalir")
    vec3 flowCurl = curlNoise(p * 0.9 + vec3(u_time * 0.45, u_dispersion_seed, u_time * 0.35));
    // Subtle radial breath keeping particles close to the text bounds (reduced by 70%)
    vec3 centerOffset = p - vec3(0.0, 0.0, 0.0);
    float centerDist = length(centerOffset);
    vec3 radialDir = centerDist > 0.001 ? normalize(centerOffset) : vec3(0.0, 1.0, 0.0);

    // Controlled, tight dispersion impulse with viscous fluid motion
    vec3 scatterImpulse = (flowCurl * 1.4 + radialDir * 0.25) * u_dispersion;
    p += scatterImpulse * u_delta * 1.8;
  }

  // 2. Viscous fluid spring attraction: gently guides particles into the new word shape
  // Retains at least 35% attraction during dispersion so particles flow in silky streams
  float attractFactor = 1.0 - smoothstep(0.15, 0.9, u_dispersion) * 0.65;
  vec3 toOrigin = origin - p;
  float springStrength = mix(1.4, 2.6, attractFactor);
  p += toOrigin * clamp(u_delta * springStrength, 0.0, 0.16) * attractFactor;

  // 3. Living ambient fluid curl noise breathing around the letters
  vec3 curl = curlNoise(p * u_curl_freq + vec3(0.0, 0.0, u_time * u_curl_speed));
  p += curl * u_delta * 0.025;

  // 4. Interactive Mouse Repulsion Area
  vec3 diff = p - u_mouse;
  float d = length(diff);
  if (d < u_dist && d > 0.0001) {
    float factor = 1.0 - (d / u_dist);
    vec3 repulseDir = normalize(diff + curl * 0.35);
    p += repulseDir * (factor * factor) * u_repulsion_strength;
  }

  // 5. Safety boundary to prevent particles getting permanently lost offscreen
  if (length(p) > 9.0) {
    p = mix(p, origin, 0.15);
  }

  gl_FragColor = vec4(p, life);
}
`;
