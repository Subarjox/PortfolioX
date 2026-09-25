"use client";

import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { SIMULATION_FRAGMENT_SHADER } from "@/shaders/gpgpu/simulation.frag";
import { createPositionDataTexture } from "@/utils/particleData";

interface UseGPGPUSimulationOptions {
  size?: number; // e.g. 128 for 16,384 particles
  text?: string;
  repulsionDist?: number;
  repulsionStrength?: number;
}

export function useGPGPUSimulation({
  size = 128,
  text = "fahreza",
  repulsionDist = 1.0,
  repulsionStrength = 0.09,
}: UseGPGPUSimulationOptions = {}) {
  const { gl } = useThree();

  // Create initial data texture sampled from text
  const { originTexture } = useMemo(() => {
    return { originTexture: createPositionDataTexture(size, text) };
  }, [size, text]);

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
  }>({
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
    const prevTarget = gl.getRenderTarget();
    gl.setRenderTarget(fboA);
    gl.render(simScene, simCamera);
    gl.setRenderTarget(fboB);
    gl.render(simScene, simCamera);
    gl.setRenderTarget(prevTarget);

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
