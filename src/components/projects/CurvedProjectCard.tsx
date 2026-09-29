"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { ProjectItem } from "@/data/projectsData";
import { calculateCardLayout, calculateCurvedVertices } from "@/utils/curvedMeshMath";

interface CurvedProjectCardProps {
  project: ProjectItem;
  index: number;
  progress: number;
  totalCards: number;
  isMobile: boolean;
}

export function CurvedProjectCard({
  project,
  index,
  progress,
  totalCards,
  isMobile,
}: CurvedProjectCardProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Generate curved plane geometry with concave cylinder arc
  const geometry = useMemo(() => {
    const width = isMobile ? 2.6 : 3.4;
    const height = isMobile ? 3.4 : 2.2;
    const segmentsX = 32;
    const segmentsY = 1;
    const geo = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);

    const pos = geo.attributes.position;
    const curveFactor = isMobile ? 0.08 : 0.11;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = calculateCurvedVertices(x, curveFactor);
      pos.setZ(i, z);
    }
    geo.computeVertexNormals();
    return geo;
  }, [isMobile]);

  // Clean up WebGL geometry on unmount or breakpoint change to prevent memory leaks
  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  // Texture loading with high quality fallback canvas texture
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 680;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 1024, 680);
      grad.addColorStop(0, project.accentColor);
      grad.addColorStop(1, "#111115");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 680);

      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.font = '700 80px "Inter", sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(project.id, 512, 340);

      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.font = '500 24px "Inter", sans-serif';
      ctx.fillText(project.title, 512, 420);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.generateMipmaps = true;

    return tex;
  }, [project.accentColor, project.id, project.title]);

  // Clean up canvas fallback texture on unmount
  useEffect(() => {
    return () => {
      if (texture) texture.dispose();
    };
  }, [texture]);

  const [imageTexture, setImageTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let active = true;
    const loader = new THREE.TextureLoader();
    loader.load(
      project.image,
      (loadedTex) => {
        if (!active) {
          loadedTex.dispose();
          return;
        }
        loadedTex.colorSpace = THREE.SRGBColorSpace;
        loadedTex.minFilter = THREE.LinearMipmapLinearFilter;
        setImageTexture(loadedTex);
      },
      undefined,
      () => {
        // Fallback texture remains active if file not found
      }
    );
    return () => {
      active = false;
    };
  }, [project.image]);

  // Clean up loaded image texture on unmount or URL change
  useEffect(() => {
    return () => {
      if (imageTexture) imageTexture.dispose();
    };
  }, [imageTexture]);

  // Dynamic position with frame-rate independent exponential decay damping
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const target = calculateCardLayout(index, progress, totalCards, isMobile);

    const lambda = 8.5; // Damping responsiveness factor
    meshRef.current.position.x = THREE.MathUtils.damp(
      meshRef.current.position.x,
      target.x,
      lambda,
      delta
    );
    meshRef.current.position.y = THREE.MathUtils.damp(
      meshRef.current.position.y,
      target.y,
      lambda,
      delta
    );
    meshRef.current.position.z = THREE.MathUtils.damp(
      meshRef.current.position.z,
      target.z,
      lambda,
      delta
    );

    meshRef.current.rotation.y = THREE.MathUtils.damp(
      meshRef.current.rotation.y,
      target.rotationY,
      lambda,
      delta
    );
    meshRef.current.rotation.z = THREE.MathUtils.damp(
      meshRef.current.rotation.z,
      target.rotationZ,
      lambda,
      delta
    );

    meshRef.current.scale.x = THREE.MathUtils.damp(
      meshRef.current.scale.x,
      target.scale,
      lambda,
      delta
    );
    meshRef.current.scale.y = THREE.MathUtils.damp(
      meshRef.current.scale.y,
      target.scale,
      lambda,
      delta
    );
    meshRef.current.scale.z = THREE.MathUtils.damp(
      meshRef.current.scale.z,
      target.scale,
      lambda,
      delta
    );
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial
        map={imageTexture || texture || undefined}
        color="#ffffff"
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}
