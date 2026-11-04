"use client";

import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGPGPUSimulation } from "@/hooks/useGPGPUSimulation";
import { generateParticleUVs } from "@/utils/particleData";
import { PARTICLE_VERTEX_SHADER } from "@/shaders/render/particles.vert";
import { PARTICLE_FRAGMENT_SHADER } from "@/shaders/render/particles.frag";

interface GPGPUParticlesProps {
  size?: number; // 110 gives 110*110 = 12,100 high-density particles
  text?: string;
  particleScale?: number;
  isVisible?: boolean;
}

export function GPGPUParticles({
  size = 110,
  text = "fahreza",
  particleScale = 1.0,
  isVisible = true,
}: GPGPUParticlesProps) {
  const { stepSimulation, getCurrentTexture } = useGPGPUSimulation({
    size,
    text,
    repulsionDist: 0.95,
    repulsionStrength: 0.084, // Reduced by 30% from 0.12 per user request
  });

  const pointsRef = useRef<THREE.Points>(null);
  const mousePlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouse3D = useRef(new THREE.Vector3(9999, 9999, 0));

  // Reset mouse coordinate when cursor leaves window so particles settle cleanly
  useEffect(() => {
    const handleMouseLeave = () => {
      mouse3D.current.set(9999, 9999, 0);
    };
    window.addEventListener("mouseout", (e) => {
      if (!e.relatedTarget) {
        handleMouseLeave();
      }
    });
    return () => {
      window.removeEventListener("mouseout", handleMouseLeave);
    };
  }, []);

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

  // Render shader material with dynamic hover blue color uniforms
  const renderUniforms = useMemo(
    () => ({
      u_positions: { value: getCurrentTexture() },
      u_pixelRatio: { value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1 },
      u_size: { value: particleScale },
      u_mouse: { value: new THREE.Vector3(9999, 9999, 0) },
      u_hover_radius: { value: 1.05 },
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
    if (!isVisible) return;
    // Unproject pointer to 3D world plane z=0
    raycaster.setFromCamera(pointer, camera);
    const intersection = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(mousePlane, intersection)) {
      mouse3D.current.copy(intersection);
    }

    // Step GPGPU compute pass
    const currentTexture = stepSimulation(mouse3D.current, delta, clock.getElapsedTime());

    // Feed current positions and mouse coordinates to particle render material
    renderUniforms.u_positions.value = currentTexture;
    renderUniforms.u_mouse.value.copy(mouse3D.current);
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
