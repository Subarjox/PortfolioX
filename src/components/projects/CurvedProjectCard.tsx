"use client";

import React, { useMemo, useRef } from "react";
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

  // Texture loading with high quality fallback canvas texture
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;

    // First create a clean placeholder canvas texture with accent color & subtle editorial styling
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 680;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Background gradient matching project accent
      const grad = ctx.createLinearGradient(0, 0, 1024, 680);
      grad.addColorStop(0, project.accentColor);
      grad.addColorStop(1, "#111115");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 680);

      // Subtle editorial watermark
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

  const [imageTexture, setImageTexture] = React.useState<THREE.Texture | null>(null);

  React.useEffect(() => {
    let active = true;
    const loader = new THREE.TextureLoader();
    loader.load(
      project.image,
      (loadedTex) => {
        if (!active) return;
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

  // Dynamic position and smooth spring interpolation
  useFrame(() => {
    if (!meshRef.current) return;
    const target = calculateCardLayout(index, progress, totalCards, isMobile);

    meshRef.current.position.x += (target.x - meshRef.current.position.x) * 0.1;
    meshRef.current.position.y += (target.y - meshRef.current.position.y) * 0.1;
    meshRef.current.position.z += (target.z - meshRef.current.position.z) * 0.1;

    meshRef.current.rotation.y += (target.rotationY - meshRef.current.rotation.y) * 0.1;
    meshRef.current.rotation.z += (target.rotationZ - meshRef.current.rotation.z) * 0.1;
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
