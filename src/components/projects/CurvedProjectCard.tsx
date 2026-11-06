"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { ProjectItem } from "@/data/projectsData";
import {
  calculateCardLayout,
  calculateCurvedVertices,
  calculateDynamicCurveFactor,
} from "@/utils/curvedMeshMath";

interface CurvedProjectCardProps {
  project: ProjectItem;
  index: number;
  progress: number;
  totalCards: number;
  isMobile: boolean;
  onHover?: (index: number | null) => void;
  onClickCard?: (project: ProjectItem) => void;
}

export function CurvedProjectCard({
  project,
  index,
  progress,
  totalCards,
  isMobile,
  onHover,
  onClickCard,
}: CurvedProjectCardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const currentCurveRef = useRef<number | null>(null);
  const pointerDownPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Segmented plane geometry:
  // Strictly matched to 16:9 thumbnail aspect ratio (1.778+) plus parabolic curve compensation
  // Desktop: 3.4 x 1.85 (~1.84 ratio)
  // Mobile: 2.6 x 1.38 (~1.88 ratio)
  const geometry = useMemo(() => {
    const width = isMobile ? 2.6 : 3.4;
    const height = isMobile ? 1.38 : 1.85;
    const segmentsX = 32;
    const segmentsY = 1;
    const geo = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);

    // Initial calculation of vertex positions according to initial progress
    const activeFloat = progress * (totalCards - 1);
    const absDiff = Math.abs(index - activeFloat);
    const maxCurve = isMobile ? 0.08 : 0.11;
    const initialCurve = calculateDynamicCurveFactor(absDiff, maxCurve);
    currentCurveRef.current = initialCurve;

    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = calculateCurvedVertices(x, initialCurve);
      pos.setZ(i, z);
    }
    return geo;
  }, [isMobile]); // eslint-disable-line react-hooks/exhaustive-deps

  // Clean up WebGL geometry on unmount or breakpoint change to prevent memory leaks
  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  // Texture loading with high quality fallback canvas texture matching 16:9
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 1280, 720);
      grad.addColorStop(0, project.accentColor);
      grad.addColorStop(1, "#111115");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1280, 720);

      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.font = '700 90px "Inter", sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(project.id, 640, 340);

      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.font = '500 28px "Inter", sans-serif';
      ctx.fillText(project.title, 640, 430);
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

  // Dynamic position, orientation, scale, and curvature damping in animation loop
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

    // Dynamic curvature transition:
    // When card is in the center (absDiff = 0): bends to 0 (perfect flat rectangle / "kotak sempurna")
    // When moved/scrolled away (absDiff increases): smoothly curves to maxCurve ("sedikit melengkung")
    const activeFloat = progress * (totalCards - 1);
    const absDiff = Math.abs(index - activeFloat);
    const maxCurve = isMobile ? 0.08 : 0.11;
    const targetCurve = calculateDynamicCurveFactor(absDiff, maxCurve);

    const prevCurve = currentCurveRef.current ?? targetCurve;
    const nextCurve = THREE.MathUtils.damp(
      prevCurve,
      targetCurve,
      lambda,
      delta
    );
    currentCurveRef.current = nextCurve;

    // Only update geometry buffer if curvature actually changed significantly
    if (Math.abs(nextCurve - prevCurve) > 0.0001) {
      const pos = geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = calculateCurvedVertices(x, nextCurve);
        pos.setZ(i, z);
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      onPointerDown={(e) => {
        pointerDownPos.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        const dx = Math.abs(e.clientX - pointerDownPos.current.x);
        const dy = Math.abs(e.clientY - pointerDownPos.current.y);
        // Threshold check: ensure it was a clean click/tap and not a scroll drag
        if (dx < 8 && dy < 8) {
          onClickCard?.(project);
        }
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
        onHover?.(index);
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
        onHover?.(null);
      }}
    >
      <meshBasicMaterial
        map={imageTexture || texture || undefined}
        color="#ffffff"
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}
