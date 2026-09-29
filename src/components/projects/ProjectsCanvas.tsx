"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { ProjectsGallery } from "./ProjectsGallery";

interface ProjectsCanvasProps {
  progress: number;
  activeIndex: number;
  isMobile: boolean;
}

export function ProjectsCanvas({
  progress,
  activeIndex,
  isMobile,
}: ProjectsCanvasProps) {
  return (
    <div className="absolute inset-0 pointer-events-auto">
      <Canvas
        style={{ touchAction: "pan-y" }}
        camera={{
          position: [0, 0, isMobile ? 5.2 : 4.4],
          fov: isMobile ? 50 : 42,
        }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ProjectsGallery
          progress={progress}
          activeIndex={activeIndex}
          isMobile={isMobile}
        />
      </Canvas>
    </div>
  );
}
