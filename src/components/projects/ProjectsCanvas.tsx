"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { ProjectsGallery } from "./ProjectsGallery";
import { ProjectItem } from "@/data/projectsData";

interface ProjectsCanvasProps {
  progress: number;
  activeIndex: number;
  totalStops?: number;
  isMobile: boolean;
  isVisible?: boolean;
  onHover?: (index: number | null) => void;
  onClickCard?: (project: ProjectItem) => void;
}

export function ProjectsCanvas({
  progress,
  activeIndex,
  totalStops,
  isMobile,
  isVisible = true,
  onHover,
  onClickCard,
}: ProjectsCanvasProps) {
  return (
    <div className="absolute inset-0 pointer-events-auto">
      <Canvas
        frameloop={isVisible ? "always" : "never"}
        style={{ touchAction: "pan-y" }}
        camera={{
          position: [0, 0, isMobile ? 5.2 : 4.4],
          fov: isMobile ? 50 : 42,
        }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ProjectsGallery
          progress={progress}
          activeIndex={activeIndex}
          totalStops={totalStops}
          isMobile={isMobile}
          onHover={onHover}
          onClickCard={onClickCard}
        />
      </Canvas>
    </div>
  );
}
