"use client";

import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { SIMULATION_FRAGMENT_SHADER } from "@/shaders/gpgpu/simulation.frag";
import { createPositionDataTexture } from "@/utils/particleData";

interface UseGPGPUSimulationOptions {
  size?: number; // e.g. 48 for 2,304 particles
  text?: string;
  repulsionDist?: number;
  repulsionStrength?: number;
}

export function useGPGPUSimulation({
  size = 48,
  text = "fahreza",
  repulsionDist = 1.0,
  repulsionStrength = 0.09,
}: UseGPGPUSimulationOptions = {}) {
  const { gl } = useThree();

  // Cache textures for different words to avoid repetitive allocations
  const textureCacheRef = useRef<Map<string, THREE.DataTexture>>(new Map());

  const getOrCreateTexture = (word: string): THREE.DataTexture => {
    let tex = textureCacheRef.current.get(word);
    if (!tex) {
      tex = createPositionDataTexture(size, word);
      textureCacheRef.current.set(word, tex);
    }
    return tex;
  };

  // Initial texture for setup
  const initialTexture = useMemo(() => {
    return getOrCreateTexture(text);
  }, [size]); // Note: only depend on size so initial FBO is stable

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

  const dispersionRef = useRef<number>(0);
  const dispersionSeedRef = useRef<number>(1.0);
  const prevTextRef = useRef<string>(text);

  const uniformsRef = useRef<{
    u_positions: { value: THREE.Texture };
    u_origin: { value: THREE.Texture };
    u_mouse: { value: THREE.Vector3 };
    u_dist: { value: number };
    u_repulsion_strength: { value: number };
    u_time: { value: number };
    u_delta: { value: number };
    u_curl_freq: { value: number };
    u_curl_speed: { value: number };
    u_dispersion: { value: number };
    u_dispersion_seed: { value: number };
  }>({
    u_positions: { value: initialTexture },
    u_origin: { value: initialTexture },
    u_mouse: { value: new THREE.Vector3(9999, 9999, 0) },
    u_dist: { value: repulsionDist },
    u_repulsion_strength: { value: repulsionStrength },
    u_time: { value: 0 },
    u_delta: { value: 0 },
    u_curl_freq: { value: 0.35 },
    u_curl_speed: { value: 0.15 },
    u_dispersion: { value: 0.0 },
    u_dispersion_seed: { value: 1.0 },
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

  // When text changes, update target origin texture and trigger dispersion burst ("partikel buyar")
  useEffect(() => {
    if (prevTextRef.current === text) return;
    prevTextRef.current = text;

    const newTexture = getOrCreateTexture(text);
    uniformsRef.current.u_origin.value = newTexture;

    // Trigger dispersion explosion ("partikel buyar")
    dispersionRef.current = 1.0;
    dispersionSeedRef.current = Math.random() * 50.0 + 1.0;
  }, [text, size]);

  // One-time setup of Quad and initial FBO fill
  useEffect(() => {
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMaterial);
    simScene.add(quad);

    // Initial render from origin to fboA and fboB
    const prevTarget = gl.getRenderTarget();
    gl.setRenderTarget(fboA);
    gl.render(simScene, simCamera);
    gl.setRenderTarget(fboB);
    gl.render(simScene, simCamera);
    gl.setRenderTarget(prevTarget);

    const cache = textureCacheRef.current;

    return () => {
      quad.geometry.dispose();
      simMaterial.dispose();
      fboA.dispose();
      fboB.dispose();
      cache.forEach((tex) => tex.dispose());
      cache.clear();
    };
  }, [gl, simScene, simCamera, simMaterial, fboA, fboB]);

  const currentFBORef = useRef(fboA);
  const nextFBORef = useRef(fboB);

  // Ping-Pong update loop
  const stepSimulation = (mouseWorld: THREE.Vector3, delta: number, elapsedTime: number) => {
    const uniforms = uniformsRef.current;
    const clampedDelta = Math.min(delta, 0.05);

    // Smoothly decay dispersion factor back to 0.0 with gentle flowing pace ("seolah olah seperti mengalir")
    if (dispersionRef.current > 0.0001) {
      dispersionRef.current = Math.max(0, dispersionRef.current - clampedDelta * 0.45);
    }

    uniforms.u_dispersion.value = dispersionRef.current;
    uniforms.u_dispersion_seed.value = dispersionSeedRef.current;
    uniforms.u_positions.value = currentFBORef.current.texture;
    uniforms.u_mouse.value.copy(mouseWorld);
    uniforms.u_time.value = elapsedTime;
    uniforms.u_delta.value = clampedDelta;

    // Render compute pass to next buffer
    const prevTarget = gl.getRenderTarget();
    gl.setRenderTarget(nextFBORef.current);
    gl.render(simScene, simCamera);
    gl.setRenderTarget(prevTarget);

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
