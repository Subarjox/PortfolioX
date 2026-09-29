"use client";

import React from "react";
import { PROJECTS_DATA } from "@/data/projectsData";
import { CurvedProjectCard } from "./CurvedProjectCard";
import { DecorativeArc } from "./DecorativeArc";

interface ProjectsGalleryProps {
  progress: number;
  activeIndex: number;
  isMobile: boolean;
}

export function ProjectsGallery({
  progress,
  activeIndex,
  isMobile,
}: ProjectsGalleryProps) {
  return (
    <group position={[0, 0, 0]}>
      <ambientLight intensity={1.0} />
      <directionalLight position={[5, 10, 7]} intensity={1.2} />

      {PROJECTS_DATA.map((project, idx) => (
        <CurvedProjectCard
          key={project.id}
          project={project}
          index={idx}
          progress={progress}
          totalCards={PROJECTS_DATA.length}
          isMobile={isMobile}
        />
      ))}

      <DecorativeArc progress={progress} isMobile={isMobile} />
    </group>
  );
}
