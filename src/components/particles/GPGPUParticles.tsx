"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useGPGPUSimulation } from "@/hooks/useGPGPUSimulation";
import { generateParticleUVs } from "@/utils/particleData";
import { PARTICLE_VERTEX_SHADER } from "@/shaders/render/particles.vert";
import { PARTICLE_FRAGMENT_SHADER } from "@/shaders/render/particles.frag";

interface GPGPUParticlesProps {
  size?: number; // 48 gives 48*48 = 2,304 discrete stippled particles matching partikle.png
  text?: string;
  particleScale?: number;
}

export function GPGPUParticles({
  size = 48,
  text = "code",
  particleScale = 1.0,
}: GPGPUParticlesProps) {
  const { stepSimulation, getCurrentTexture } = useGPGPUSimulation({ size, text });

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
