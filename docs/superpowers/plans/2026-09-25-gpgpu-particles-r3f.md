# Interactive GPGPU Particle System (R3F + Next.js) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-grade, interactive GPGPU (General-Purpose GPU compute) particle system in Next.js using React Three Fiber (R3F), simulating 262,144+ particles via FBO ping-pong with custom GLSL Curl Noise and mouse repulsion, styled with a minimalist luxury dark mode UI.

**Architecture:**
- **Compute Simulation Phase (GPGPU Ping-Pong FBO):** Double WebGLRenderTarget buffer (`FloatType`, `NearestFilter`) running a full-screen simulation quad shader with an orthographic camera. Computes velocity advection via 3D divergence-free `curlNoise(p)` and interactive 3D mouse repulsion, writing updated particle positions back to the target FBO every frame.
- **Render Phase (Custom Particle Shader):** Instanced or vertex point cloud (`<points frustumCulled={false}>`) mapping vertex UV references to `sampler2D u_positions` from the current FBO. Applies distance-attenuated `gl_PointSize = 2.0`, soft circular alpha disc falloff, and champagne gold/warm white color grading.
- **Application & UI Phase (Next.js App Router + Tailwind):** Client-side dynamic R3F Canvas wrapper with unprojected pointer tracking, layered below a minimalist, responsive dark-mode HUD featuring `'HIGH-END DIGITAL EXPERIENCES...'` and `'SCROLL TO EXPLORE'`.

**Tech Stack:**
- Next.js 15 (App Router, TypeScript)
- React 19 / React Three Fiber (`@react-three/fiber` v8/v9)
- Three.js (`three` + `@types/three`)
- `@react-three/drei`
- Tailwind CSS v4 / PostCSS

**Spec:** Architectural blueprint from user prompt (`image_1.png` blueprint specification).

---

## Global Constraints

- Must run smoothly at 60+ FPS on standard modern desktop GPUs for at least 512x512 (262,144 particles).
- All WebGL simulation buffers must use `THREE.FloatType` or fallback `THREE.HalfFloatType` with `NearestFilter` to prevent interpolation distortion.
- Canvas must be SSR-disabled (`next/dynamic` with `ssr: false`) to avoid hydration mismatch with WebGL context.
- UI overlay must have `pointer-events-none` on containers and `pointer-events-auto` on interactive buttons to ensure mouse events reach the R3F Canvas.
- Particle point geometry must have `frustumCulled={false}` to avoid culling when particle coordinates shift dynamically.

## Review Focus

1. **Float Texture Support:** WebGL2 allows float render targets, but some mobile/Safari browsers require `EXT_color_buffer_float` or fallback to `HalfFloatType`.
2. **Ping-Pong Swapping Race Condition:** FBO source and target must alternate cleanly every frame without binding the same target as input texture.
3. **Mouse Coordinate Unprojection:** 2D pointer coordinates (-1 to 1) must be projected into the 3D plane `z = 0` to calculate accurate distance `length(p - u_mouse)`.
4. **Window Resizing / Aspect Ratio:** Viewport resizing must not stretch or disrupt FBO texture coordinates or simulation step delta.
5. **Memory Leak Prevention:** All render targets, geometries, and materials must be disposed of cleanly on component unmount.

---

## Plan Tasks

### Task 1: Initialize Next.js Project & Dependencies

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.mjs`
- Create: `postcss.config.mjs`
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`

**Interfaces:**
- Produces: Base Next.js project with Three.js, R3F, Drei, and Tailwind CSS configured.

- [ ] **Step 1: Create package.json with dependencies**

```json
{
  "name": "web-barjox",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run"
  },
  "dependencies": {
    "@react-three/drei": "^9.121.4",
    "@react-three/fiber": "^8.17.14",
    "clsx": "^2.1.1",
    "lucide-react": "^0.475.0",
    "next": "^15.1.7",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwind-merge": "^3.0.1",
    "three": "^0.173.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0.7",
    "@types/node": "^22.13.4",
    "@types/react": "^19.0.8",
    "@types/react-dom": "^19.0.3",
    "@types/three": "^0.173.0",
    "postcss": "^8.5.2",
    "tailwindcss": "^4.0.7",
    "typescript": "^5.7.3",
    "vitest": "^3.0.5"
  }
}
```

- [ ] **Step 2: Run npm install**

Run: `npm install`
Expected: `added ... packages in ...`

- [ ] **Step 3: Create tsconfig.json, next.config.mjs, and postcss.config.mjs**

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`next.config.mjs`:
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      type: 'asset/source',
    });
    return config;
  },
};

export default nextConfig;
```

`src/app/globals.css`:
```css
@import "tailwindcss";

:root {
  --background: #060608;
  --foreground: #ededed;
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  overflow: hidden;
  margin: 0;
  padding: 0;
  user-select: none;
}
```

`src/app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BARJOX - Interactive GPGPU Particle System",
  description: "High-end interactive GPGPU fluid particle simulation with React Three Fiber",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#060608] text-white antialiased overflow-hidden h-screen w-screen">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify build config**

Run: `npx next --version`
Expected: Next.js version output.

---

### Task 2: Implement GPGPU Simulation & Curl Noise GLSL Shaders

**Files:**
- Create: `src/shaders/gpgpu/simulation.frag.ts`
- Create: `src/shaders/gpgpu/curlNoise.glsl.ts`
- Test: `tests/shaders.test.ts`

**Interfaces:**
- Produces:
  - `CURL_NOISE_GLSL`: String containing manual 3D Simplex noise and divergence-free `curlNoise(vec3 p)` function.
  - `SIMULATION_FRAGMENT_SHADER`: Complete GLSL fragment shader taking `u_positions`, `u_origin`, `u_mouse`, `u_dist`, `u_repulsion_strength`, `u_time`, `u_delta`, `u_curl_freq`, `u_curl_speed` to calculate the next particle state.

- [ ] **Step 1: Write shader test**

Create `tests/shaders.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { CURL_NOISE_GLSL } from "../src/shaders/gpgpu/curlNoise.glsl";
import { SIMULATION_FRAGMENT_SHADER } from "../src/shaders/gpgpu/simulation.frag";

describe("GPGPU Shaders", () => {
  it("contains curlNoise function definition", () => {
    expect(CURL_NOISE_GLSL).toContain("vec3 curlNoise(vec3 p)");
    expect(CURL_NOISE_GLSL).toContain("float snoise(vec3 v)");
  });

  it("contains simulation uniforms and mouse repulsion logic", () => {
    expect(SIMULATION_FRAGMENT_SHADER).toContain("uniform sampler2D u_positions;");
    expect(SIMULATION_FRAGMENT_SHADER).toContain("uniform vec3 u_mouse;");
    expect(SIMULATION_FRAGMENT_SHADER).toContain("if (d < u_dist");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/shaders.test.ts`
Expected: FAIL (files do not exist yet).

- [ ] **Step 3: Implement `src/shaders/gpgpu/curlNoise.glsl.ts`**

```ts
export const CURL_NOISE_GLSL = /* glsl */ `
// Stefan Gustavson & Ian McEwan Simplex 3D Noise (GLSL)
vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

vec3 snoise3D(vec3 p) {
  return vec3(
    snoise(p),
    snoise(p + vec3(43.12, 115.43, 78.21)),
    snoise(p + vec3(127.54, 31.87, 241.98))
  );
}

// Curl Noise: analytical derivative approximation for fluid divergence-free motion
vec3 curlNoise(vec3 p) {
  const float e = 0.01;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);

  vec3 p_x0 = snoise3D(p - dx);
  vec3 p_x1 = snoise3D(p + dx);
  vec3 p_y0 = snoise3D(p - dy);
  vec3 p_y1 = snoise3D(p + dy);
  vec3 p_z0 = snoise3D(p - dz);
  vec3 p_z1 = snoise3D(p + dz);

  float x = (p_y1.z - p_y0.z) - (p_z1.y - p_z0.y);
  float y = (p_z1.x - p_z0.x) - (p_x1.z - p_x0.z);
  float z = (p_x1.y - p_x0.y) - (p_y1.x - p_y0.x);

  return normalize(vec3(x, y, z) / (2.0 * e));
}
`;
```

- [ ] **Step 4: Implement `src/shaders/gpgpu/simulation.frag.ts`**

```ts
import { CURL_NOISE_GLSL } from "./curlNoise.glsl";

export const SIMULATION_FRAGMENT_SHADER = /* glsl */ `
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
```

- [ ] **Step 5: Run tests and verify PASS**

Run: `npx vitest run tests/shaders.test.ts`
Expected: 2 passed.

---

### Task 3: Implement Particle Render Shaders (Vertex & Fragment)

**Files:**
- Create: `src/shaders/render/particles.vert.ts`
- Create: `src/shaders/render/particles.frag.ts`
- Test: `tests/renderShaders.test.ts`

**Interfaces:**
- Produces:
  - `PARTICLE_VERTEX_SHADER`: GLSL vertex shader sampling FBO texture at `attribute vec2 reference`, calculating `gl_PointSize = 2.0` with distance attenuation.
  - `PARTICLE_FRAGMENT_SHADER`: GLSL fragment shader rendering smooth circular points with luxury white/gold palette and alpha blending.

- [ ] **Step 1: Write test for render shaders**

Create `tests/renderShaders.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { PARTICLE_VERTEX_SHADER } from "../src/shaders/render/particles.vert";
import { PARTICLE_FRAGMENT_SHADER } from "../src/shaders/render/particles.frag";

describe("Render Shaders", () => {
  it("vertex shader binds u_positions and sets gl_PointSize with size attenuation", () => {
    expect(PARTICLE_VERTEX_SHADER).toContain("uniform sampler2D u_positions;");
    expect(PARTICLE_VERTEX_SHADER).toContain("attribute vec2 reference;");
    expect(PARTICLE_VERTEX_SHADER).toContain("gl_PointSize = 2.0");
  });

  it("fragment shader applies smooth alpha blending and gold/white palette", () => {
    expect(PARTICLE_FRAGMENT_SHADER).toContain("gl_PointCoord");
    expect(PARTICLE_FRAGMENT_SHADER).toContain("discard");
    expect(PARTICLE_FRAGMENT_SHADER).toContain("vec3 gold");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/renderShaders.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `src/shaders/render/particles.vert.ts`**

```ts
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
```

- [ ] **Step 4: Implement `src/shaders/render/particles.frag.ts`**

```ts
export const PARTICLE_FRAGMENT_SHADER = /* glsl */ `
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
```

- [ ] **Step 5: Run tests and verify PASS**

Run: `npx vitest run tests/renderShaders.test.ts`
Expected: 2 passed.

---

### Task 4: GPGPU Simulation Engine & Ping-Pong FBO Hook

**Files:**
- Create: `src/hooks/useGPGPUSimulation.ts`
- Create: `src/utils/particleData.ts`
- Test: `tests/particleData.test.ts`

**Interfaces:**
- Produces:
  - `generateInitialPositions(size: number)`: creates Float32Array texture with spherical/torus fluid particle distribution.
  - `useGPGPUSimulation`: React hook managing two `THREE.WebGLRenderTarget` buffers (`fboA`, `fboB`), an orthographic camera, a simulation quad mesh, uniforms updates (`u_mouse`, `u_time`, `u_delta`), and ping-pong swapping inside `useFrame`.

- [ ] **Step 1: Write test for particle data generation**

Create `tests/particleData.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { generateInitialParticleData } from "../src/utils/particleData";

describe("Particle Data Utility", () => {
  it("generates float data of length size * size * 4", () => {
    const size = 128;
    const data = generateInitialParticleData(size);
    expect(data.length).toBe(size * size * 4);
    // Assert coordinates are non-NaN
    expect(Number.isNaN(data[0])).toBe(false);
    expect(Number.isNaN(data[1])).toBe(false);
    expect(Number.isNaN(data[2])).toBe(false);
  });
});
```

- [ ] **Step 2: Implement `src/utils/particleData.ts`**

```ts
import * as THREE from "three";

export function generateInitialParticleData(size: number): Float32Array {
  const count = size * size;
  const data = new Float32Array(count * 4);

  for (let i = 0; i < count; i++) {
    const i4 = i * 4;

    // Distribute particles across a layered spherical fluid volume
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const radius = 1.0 + Math.pow(Math.random(), 1.5) * 2.2;

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    data[i4 + 0] = x;
    data[i4 + 1] = y;
    data[i4 + 2] = z;
    data[i4 + 3] = Math.random(); // Lifetime / phase
  }

  return data;
}

export function createPositionDataTexture(size: number): THREE.DataTexture {
  const data = generateInitialParticleData(size);
  const texture = new THREE.DataTexture(
    data,
    size,
    size,
    THREE.RGBAFormat,
    THREE.FloatType
  );
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.needsUpdate = true;
  return texture;
}

export function generateParticleUVs(size: number): Float32Array {
  const count = size * size;
  const uvs = new Float32Array(count * 2);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 2;
      uvs[idx + 0] = (x + 0.5) / size;
      uvs[idx + 1] = (y + 0.5) / size;
    }
  }

  return uvs;
}
```

- [ ] **Step 3: Run particle data tests**

Run: `npx vitest run tests/particleData.test.ts`
Expected: PASS.

- [ ] **Step 4: Implement `src/hooks/useGPGPUSimulation.ts`**

```ts
"use client";

import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { SIMULATION_FRAGMENT_SHADER } from "@/shaders/gpgpu/simulation.frag";
import { createPositionDataTexture } from "@/utils/particleData";

interface UseGPGPUSimulationOptions {
  size?: number; // e.g. 512 for 262,144 particles
  repulsionDist?: number;
  repulsionStrength?: number;
}

export function useGPGPUSimulation({
  size = 512,
  repulsionDist = 1.2,
  repulsionStrength = 0.08,
}: UseGPGPUSimulationOptions = {}) {
  const { gl } = useThree();

  // Create initial data texture
  const { originTexture } = useMemo(() => {
    return { originTexture: createPositionDataTexture(size) };
  }, [size]);

  // Set up double render targets (Ping-Pong)
  const [fboA, fboB] = useMemo(() => {
    const options: THREE.RenderTargetOptions = {
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      stencilBuffer: false,
      depthBuffer: false,
    };
    return [
      new THREE.WebGLRenderTarget(size, size, options),
      new THREE.WebGLRenderTarget(size, size, options),
    ];
  }, [size]);

  // Orthographic camera & quad scene for GPGPU compute
  const simScene = useMemo(() => new THREE.Scene(), []);
  const simCamera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), []);

  const uniformsRef = useRef({
    u_positions: { value: originTexture },
    u_origin: { value: originTexture },
    u_mouse: { value: new THREE.Vector3(9999, 9999, 0) },
    u_dist: { value: repulsionDist },
    u_repulsion_strength: { value: repulsionStrength },
    u_time: { value: 0 },
    u_delta: { value: 0 },
    u_curl_freq: { value: 0.35 },
    u_curl_speed: { value: 0.15 },
  });

  const simMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: uniformsRef.current,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: SIMULATION_FRAGMENT_SHADER,
    });
  }, []);

  useEffect(() => {
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMaterial);
    simScene.add(quad);

    // Initial render from origin to fboA and fboB
    gl.setRenderTarget(fboA);
    gl.render(simScene, simCamera);
    gl.setRenderTarget(fboB);
    gl.render(simScene, simCamera);
    gl.setRenderTarget(null);

    return () => {
      quad.geometry.dispose();
      simMaterial.dispose();
      fboA.dispose();
      fboB.dispose();
      originTexture.dispose();
    };
  }, [gl, simScene, simCamera, simMaterial, fboA, fboB, originTexture]);

  const currentFBORef = useRef(fboA);
  const nextFBORef = useRef(fboB);

  // Ping-Pong update loop
  const stepSimulation = (mouseWorld: THREE.Vector3, delta: number, elapsedTime: number) => {
    const uniforms = uniformsRef.current;
    uniforms.u_positions.value = currentFBORef.current.texture;
    uniforms.u_mouse.value.copy(mouseWorld);
    uniforms.u_time.value = elapsedTime;
    uniforms.u_delta.value = Math.min(delta, 0.05);

    // Render compute pass to next buffer
    gl.setRenderTarget(nextFBORef.current);
    gl.render(simScene, simCamera);
    gl.setRenderTarget(null);

    // Swap ping-pong references
    const temp = currentFBORef.current;
    currentFBORef.current = nextFBORef.current;
    nextFBORef.current = temp;

    return currentFBORef.current.texture;
  };

  return {
    stepSimulation,
    getCurrentTexture: () => currentFBORef.current.texture,
  };
}
```

---

### Task 5: R3F `GPGPUParticles` Component & Canvas Integration

**Files:**
- Create: `src/components/particles/GPGPUParticles.tsx`
- Create: `src/components/canvas/SceneCanvas.tsx`

**Interfaces:**
- Produces:
  - `<GPGPUParticles size={512} />`: R3F component rendering points with `<points frustumCulled={false}>`, calculating mouse projection on plane `z=0`, updating FBO ping-pong texture in `useFrame`.
  - `<SceneCanvas />`: Full-viewport R3F `<Canvas>` setup with responsive camera and smooth damping.

- [ ] **Step 1: Implement `src/components/particles/GPGPUParticles.tsx`**

```tsx
"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useGPGPUSimulation } from "@/hooks/useGPGPUSimulation";
import { generateParticleUVs } from "@/utils/particleData";
import { PARTICLE_VERTEX_SHADER } from "@/shaders/render/particles.vert";
import { PARTICLE_FRAGMENT_SHADER } from "@/shaders/render/particles.frag";

interface GPGPUParticlesProps {
  size?: number; // 512 gives 512*512 = 262,144 particles
  particleScale?: number;
}

export function GPGPUParticles({ size = 512, particleScale = 1.0 }: GPGPUParticlesProps) {
  const { viewport } = useThree();
  const { stepSimulation, getCurrentTexture } = useGPGPUSimulation({ size });

  const pointsRef = useRef<THREE.Points>(null);
  const mousePlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouse3D = useRef(new THREE.Vector3(9999, 9999, 0));

  // Point geometry with reference UV coordinates for FBO sampling
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = size * size;
    const positions = new Float32Array(count * 3); // Dummy vertices
    const references = generateParticleUVs(size);

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("reference", new THREE.BufferAttribute(references, 2));
    return geo;
  }, [size]);

  // Render shader material
  const renderUniforms = useMemo(
    () => ({
      u_positions: { value: getCurrentTexture() },
      u_pixelRatio: { value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1 },
      u_size: { value: particleScale },
    }),
    [getCurrentTexture, particleScale]
  );

  const renderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: renderUniforms,
      vertexShader: PARTICLE_VERTEX_SHADER,
      fragmentShader: PARTICLE_FRAGMENT_SHADER,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [renderUniforms]);

  // Frame simulation and render update
  useFrame(({ pointer, camera, clock }, delta) => {
    // Unproject pointer to 3D world plane z=0
    raycaster.setFromCamera(pointer, camera);
    const intersection = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(mousePlane, intersection)) {
      mouse3D.current.copy(intersection);
    }

    // Step GPGPU compute pass
    const currentTexture = stepSimulation(mouse3D.current, delta, clock.getElapsedTime());

    // Feed current positions to particle render material
    renderUniforms.u_positions.value = currentTexture;
  });

  return (
    <points
      ref={pointsRef}
      geometry={geometry}
      material={renderMaterial}
      frustumCulled={false}
    />
  );
}
```

- [ ] **Step 2: Implement `src/components/canvas/SceneCanvas.tsx`**

```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { GPGPUParticles } from "@/components/particles/GPGPUParticles";

export function SceneCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#060608]">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 55, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <GPGPUParticles size={512} particleScale={1.0} />
      </Canvas>
    </div>
  );
}
```

---

### Task 6: High-End Minimal Dark UI Overlay & Page Layout

**Files:**
- Create: `src/components/ui/OverlayUI.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Produces: Minimalist luxury overlay displaying:
  - Top navigation bar: Brand name 'BARJOX LABS', system telemetry, particle count badge ('262,144 PARTICLES / GPGPU').
  - Bottom left: `'HIGH-END DIGITAL EXPERIENCES THROUGH COMPUTATIONAL FLUIDS AND GENERATIVE SHADERS'`
  - Bottom right: `'SCROLL TO EXPLORE'` with pulsating downward cue.
  - Pointer events pass-through (`pointer-events-none` container, `pointer-events-auto` interactive buttons).

- [ ] **Step 1: Implement `src/components/ui/OverlayUI.tsx`**

```tsx
"use client";

import React from "react";
import { Compass, Sparkles, ChevronDown } from "lucide-react";

export function OverlayUI() {
  return (
    <div className="pointer-events-none fixed inset-0 z-10 flex flex-col justify-between p-8 md:p-12 text-[#e5e5e7]">
      {/* Top Bar Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-[#e6c875] animate-pulse" />
          <span className="text-xs font-mono tracking-[0.25em] text-[#a1a1aa] uppercase">
            BARJOX ARCHITECTURE // GPGPU
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-[#e6c875]" />
            <span className="text-[11px] font-mono tracking-wider text-zinc-300">
              262,144 PARTICLES
            </span>
          </div>
          <button className="pointer-events-auto px-4 py-1.5 rounded-full border border-[#e6c875]/40 text-[#e6c875] hover:bg-[#e6c875]/10 text-xs font-mono tracking-widest uppercase transition-colors">
            ENTER EXPERIMENT
          </button>
        </div>
      </header>

      {/* Center Subtle Ambience Cue */}
      <div className="flex justify-center">
        <span className="text-[10px] font-mono tracking-[0.3em] text-white/20 uppercase select-none">
          MOVE CURSOR TO INTERACT WITH FLUID FIELD
        </span>
      </div>

      {/* Bottom Bar Content */}
      <footer className="flex flex-col sm:flex-row items-end sm:items-end justify-between gap-6">
        {/* Bottom Left: HIGH-END DIGITAL EXPERIENCES... */}
        <div className="max-w-md space-y-2">
          <p className="text-xs md:text-sm font-light tracking-[0.18em] text-zinc-200 leading-relaxed uppercase">
            HIGH-END DIGITAL EXPERIENCES POWERED BY LOW-LEVEL COMPUTE & ARCHITECTURAL SHADERS
          </p>
          <div className="h-[1px] w-16 bg-[#e6c875]/60" />
        </div>

        {/* Bottom Right: SCROLL TO EXPLORE */}
        <div className="flex items-center gap-3 self-end">
          <span className="text-xs font-mono tracking-[0.25em] text-zinc-400 uppercase">
            SCROLL TO EXPLORE
          </span>
          <ChevronDown className="h-4 w-4 text-[#e6c875] animate-bounce" />
        </div>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Implement `src/app/page.tsx` with dynamic SSR-disabled Canvas**

```tsx
"use client";

import dynamic from "next/dynamic";
import { OverlayUI } from "@/components/ui/OverlayUI";

const SceneCanvas = dynamic(
  () => import("@/components/canvas/SceneCanvas").then((mod) => mod.SceneCanvas),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#060608]">
      <SceneCanvas />
      <OverlayUI />
    </main>
  );
}
```

---

### Task 7: End-to-End Build & Visual Verification

**Files:**
- Create: `tests/e2e.test.ts`

- [ ] **Step 1: Write integration smoke test**

Create `tests/e2e.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { generateInitialParticleData, generateParticleUVs } from "../src/utils/particleData";
import { CURL_NOISE_GLSL } from "../src/shaders/gpgpu/curlNoise.glsl";
import { SIMULATION_FRAGMENT_SHADER } from "../src/shaders/gpgpu/simulation.frag";
import { PARTICLE_VERTEX_SHADER } from "../src/shaders/render/particles.vert";

describe("E2E Architecture Alignment", () => {
  it("verifies full pipeline constants and data alignment", () => {
    const size = 512;
    const count = size * size;
    const positions = generateInitialParticleData(size);
    const uvs = generateParticleUVs(size);

    expect(count).toBe(262144);
    expect(positions.length).toBe(count * 4);
    expect(uvs.length).toBe(count * 2);

    expect(SIMULATION_FRAGMENT_SHADER).toContain("u_mouse");
    expect(SIMULATION_FRAGMENT_SHADER).toContain("curlNoise");
    expect(PARTICLE_VERTEX_SHADER).toContain("u_positions");
  });
});
```

- [ ] **Step 2: Run all test suites**

Run: `npx vitest run`
Expected: All suites PASS.

- [ ] **Step 3: Run Next.js production build**

Run: `npm run build`
Expected: Successful production build without TypeScript or bundling errors.

---

## Execution Handoff

Please review this implementation plan. Which execution approach would you prefer?

- **Subagent-driven** (Recommended): A fresh subagent implements each task and verifies it before the next task begins, followed by an end-to-end audit.
- **Native**: I implement each task sequentially in this session with verification tests at each step.
